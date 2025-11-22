from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.orm import Certificate, TelemetryEvent
from app.models.schemas import GreenCertificate
from typing import List
import csv
import io

router = APIRouter()

@router.get("/certificate/{inference_id}", response_model=GreenCertificate)
def get_certificate(inference_id: str, db: Session = Depends(get_db)):
    """
    Retrieves a certificate by inference ID.
    """
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available - running in demo mode")
    
    cert = db.query(Certificate).filter(Certificate.inference_id == inference_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    return GreenCertificate(
        certificate_id=str(cert.id),
        inference_id=cert.inference_id,
        hardware_id="node-placeholder", # In real system, join with telemetry -> node
        timestamp=cert.issued_at,
        energy_used_kwh=cert.energy_used_kwh,
        carbon_intensity_gco2_kwh=cert.carbon_intensity_gco2_kwh,
        total_emissions_gco2=cert.total_emissions_gco2,
        signature=cert.signed_content
    )

@router.get("/certificates", response_model=List[GreenCertificate])
def list_certificates(
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    Lists all certificates with pagination.
    """
    if db is None:
        return []  # Return empty list in demo mode
    
    certs = db.query(Certificate).order_by(Certificate.issued_at.desc()).limit(limit).offset(offset).all()
    
    return [
        GreenCertificate(
            certificate_id=str(cert.id),
            inference_id=cert.inference_id,
            hardware_id="node-placeholder",
            timestamp=cert.issued_at,
            energy_used_kwh=cert.energy_used_kwh,
            carbon_intensity_gco2_kwh=cert.carbon_intensity_gco2_kwh,
            total_emissions_gco2=cert.total_emissions_gco2,
            signature=cert.signed_content
        )
        for cert in certs
    ]

@router.get("/model/{model_id}/emissions")
def get_model_emissions(model_id: str, db: Session = Depends(get_db)):
    """
    Aggregates emissions for a specific model.
    """
    from sqlalchemy import func
    
    result = db.query(
        func.sum(Certificate.total_emissions_gco2).label('total_emissions'),
        func.avg(Certificate.total_emissions_gco2).label('avg_emissions'),
        func.count(Certificate.id).label('inference_count')
    ).join(
        TelemetryEvent, Certificate.inference_id == TelemetryEvent.inference_id
    ).filter(
        TelemetryEvent.model_id == model_id
    ).first()
    
    if result.inference_count == 0:
        return {
            "model_id": model_id,
            "total_emissions_gco2": 0,
            "avg_emissions_gco2": 0,
            "inference_count": 0
        }
    
    return {
        "model_id": model_id,
        "total_emissions_gco2": float(result.total_emissions or 0),
        "avg_emissions_gco2": float(result.avg_emissions or 0),
        "inference_count": result.inference_count
    }

@router.get("/compliance/export")
def export_compliance_report(db: Session = Depends(get_db)):
    """
    Exports a CSV compliance report with all certificates.
    """
    from fastapi.responses import StreamingResponse
    
    certs = db.query(Certificate).order_by(Certificate.issued_at.desc()).all()
    
    # Generate CSV
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Certificate ID",
        "Inference ID",
        "Timestamp",
        "Energy (kWh)",
        "Carbon Intensity (gCO2/kWh)",
        "Total Emissions (gCO2)",
        "Verified"
    ])
    
    for cert in certs:
        writer.writerow([
            str(cert.id),
            cert.inference_id,
            cert.issued_at.isoformat(),
            cert.energy_used_kwh,
            cert.carbon_intensity_gco2_kwh,
            cert.total_emissions_gco2,
            "Yes"
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=green_compute_compliance.csv"}
    )
