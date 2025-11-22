from fastapi.testclient import TestClient
from app.main import app
from app.services.crypto_engine import crypto_engine
import json
import uuid
from datetime import datetime

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_ingest_telemetry():
    # Mock payload
    payload = {
        "node_id": "test-node",
        "model_id": "test-model",
        "inference_id": str(uuid.uuid4()),
        "timestamp": datetime.utcnow().isoformat(),
        "energy_kwh": 0.5,
        "gpu_utilization": 95.0,
        "signature": "" # Will be ignored by mock verification in v1
    }
    
    # We need to mock the crypto verification or ensure the test payload passes
    # In our v1 code, verify_agent_signature returns True if signature exists
    payload["signature"] = "mock-sig"
    
    response = client.post("/api/v1/telemetry", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert "certificate_id" in data
    assert data["energy_used_kwh"] == 0.5
    assert data["total_emissions_gco2"] > 0
    
    # Verify the certificate signature
    decoded = crypto_engine.verify_signature(data["signature"])
    assert decoded["inference_id"] == payload["inference_id"]
