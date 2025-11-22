from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.schemas import TelemetryPayload, GreenCertificate
from app.services.carbon_oracle import carbon_oracle
from app.services.emission_calc import emission_calculator
from app.services.crypto_engine import crypto_engine
from datetime import datetime
import uuid

router = APIRouter()

# In-memory storage for demo purposes if DB is not connected, 
# but code is written to be DB-ready.
# We will just print to console in this v1 for "storage" if DB fails.

from app.services.storage import store_certificate
from app.services.verifiable_credentials import vc_engine

@router.post("/telemetry", response_model=GreenCertificate)
async def ingest_telemetry(
    payload: TelemetryPayload, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Ingests signed telemetry from the GPU Agent.
    Verifies signature, fetches carbon intensity, computes emissions, and issues a certificate.
    """
    
    # 1. Verify Agent Signature (TPM/TEE)
    # In a real scenario, we'd look up the node's public key from the DB using payload.node_id
    if not crypto_engine.verify_agent_signature(payload.dict(), payload.signature, "public_key_placeholder"):
        raise HTTPException(status_code=401, detail="Invalid Agent Signature")

    # 2. Fetch Carbon Intensity (now with real APIs!)
    # We assume the node region is known or passed. For now, default to 'us-east'
    region = "us-east" 
    carbon_data = await carbon_oracle.get_intensity(region)

    # 3. Compute Emissions
    total_emissions = emission_calculator.calculate_emissions(
        payload.energy_kwh, 
        carbon_data.intensity
    )

    # 4. Generate Certificate ID
    cert_id = str(uuid.uuid4())
    
    # 5. Generate W3C Verifiable Credential
    vc = vc_engine.create_vc(
        certificate_id=cert_id,
        inference_id=payload.inference_id,
        hardware_id=payload.node_id,
        timestamp=payload.timestamp,
        energy_kwh=payload.energy_kwh,
        carbon_intensity=carbon_data.intensity,
        total_emissions=total_emissions,
        carbon_source=carbon_data.source
    )
    
    # 6. Sign VC
    signed_vc = vc_engine.sign_vc(vc)
    
    # 7. Also create legacy JWS certificate for backward compatibility
    cert_data = {
        "certificate_id": cert_id,
        "inference_id": payload.inference_id,
        "hardware_id": payload.node_id,
        "timestamp": payload.timestamp.isoformat(),
        "energy_used_kwh": payload.energy_kwh,
        "carbon_intensity_gco2_kwh": carbon_data.intensity,
        "total_emissions_gco2": total_emissions,
        "issuer": "Verifiable Green Compute Oracle",
        "w3c_vc": signed_vc  # Embed VC in legacy format
    }
    
    signature = crypto_engine.sign_certificate(cert_data)
    
    certificate = GreenCertificate(
        **{k: v for k, v in cert_data.items() if k != "w3c_vc"},
        signature=signature
    )

    # 8. Store (Async)
    if db is not None:
        background_tasks.add_task(store_certificate, db, certificate, payload.signature)
    
    return certificate
