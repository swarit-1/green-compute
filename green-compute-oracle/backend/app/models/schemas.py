from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

class TelemetryPayload(BaseModel):
    node_id: str
    model_id: str
    inference_id: str
    timestamp: datetime
    energy_kwh: float
    gpu_utilization: float
    signature: str
    metrics: Optional[Dict[str, Any]] = None

class AttestationRequest(BaseModel):
    node_id: str
    pcr_quote: str
    nonce: str
    signature: str

class AttestationResponse(BaseModel):
    verified: bool
    timestamp: datetime

class CertificateRequest(BaseModel):
    inference_id: str

class GreenCertificate(BaseModel):
    certificate_id: str
    inference_id: str
    hardware_id: str
    timestamp: datetime
    energy_used_kwh: float
    carbon_intensity_gco2_kwh: float
    total_emissions_gco2: float
    issuer: str = "Verifiable Green Compute Oracle"
    signature: str

class CarbonIntensityResponse(BaseModel):
    region: str
    intensity: float
    unit: str = "gCO2/kWh"
    timestamp: datetime
    source: Optional[str] = "unknown"  # watttime, electricitymaps, or fallback
