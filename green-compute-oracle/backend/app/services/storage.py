from sqlalchemy.orm import Session
from app.models.orm import Certificate, TelemetryEvent
from app.models.schemas import GreenCertificate
from datetime import datetime

def store_certificate(db: Session, cert_data: GreenCertificate, raw_signature: str):
    """
    Stores the certificate and telemetry event in the database.
    """
    try:
        # 1. Store Telemetry Event (if not already exists, or simplified flow)
        # In a real app, telemetry might be stored before certificate generation.
        # Here we store them together for simplicity.
        
        # Check if telemetry exists
        existing_telemetry = db.query(TelemetryEvent).filter(TelemetryEvent.inference_id == cert_data.inference_id).first()
        if not existing_telemetry:
            telemetry = TelemetryEvent(
                inference_id=cert_data.inference_id,
                timestamp=cert_data.timestamp,
                energy_kwh=cert_data.energy_used_kwh,
                signature=raw_signature, # The agent's signature
                verified=True # We verified it in the route
            )
            db.add(telemetry)
            db.flush() # Get ID if needed

        # 2. Store Certificate
        cert_orm = Certificate(
            id=cert_data.certificate_id,
            inference_id=cert_data.inference_id,
            energy_used_kwh=cert_data.energy_used_kwh,
            carbon_intensity_gco2_kwh=cert_data.carbon_intensity_gco2_kwh,
            total_emissions_gco2=cert_data.total_emissions_gco2,
            grid_region="us-east", # Should be passed in
            certificate_hash="hash-placeholder", # Should be computed
            signed_content=cert_data.signature
        )
        db.add(cert_orm)
        db.commit()
    except Exception as e:
        print(f"Error storing certificate: {e}")
        db.rollback()
