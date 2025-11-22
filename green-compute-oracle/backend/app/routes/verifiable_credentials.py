from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.orm import Certificate
from app.services.verifiable_credentials import vc_engine
from datetime import datetime
import json

router = APIRouter()

@router.get("/certificate/{inference_id}/vc")
def get_verifiable_credential(inference_id: str, db: Session = Depends(get_db)):
    """
    Retrieves a W3C Verifiable Credential for a certificate.
    Returns JSON-LD format as per W3C VC Data Model.
    """
    if db is None:
        raise HTTPException(status_code=503, detail="Database not available")
    
    cert = db.query(Certificate).filter(Certificate.inference_id == inference_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    
    # Regenerate W3C VC from stored certificate data
    vc = vc_engine.create_vc(
        certificate_id=str(cert.id),
        inference_id=cert.inference_id,
        hardware_id="node-placeholder",  # Would join with telemetry in production
        timestamp=cert.issued_at,
        energy_kwh=cert.energy_used_kwh,
        carbon_intensity=cert.carbon_intensity_gco2_kwh,
        total_emissions=cert.total_emissions_gco2,
        carbon_source="stored"
    )
    
    # Sign it
    signed_vc = vc_engine.sign_vc(vc)
    
    # Return as JSON-LD with correct content type
    return Response(
        content=vc_engine.to_json_ld(signed_vc),
        media_type="application/ld+json"
    )

@router.post("/certificate/{inference_id}/verify")
def verify_verifiable_credential(
    inference_id: str,
    vc_data: dict,
    db: Session = Depends(get_db)
):
    """
    Verifies a W3C Verifiable Credential.
    """
    is_valid = vc_engine.verify_vc(vc_data)
    
    return {
        "valid": is_valid,
        "verified_at": datetime.utcnow().isoformat(),
        "credential_id": vc_data.get("id"),
        "subject": vc_data.get("credentialSubject", {}).get("id")
    }
