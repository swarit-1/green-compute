import time
import json
import uuid
import requests
import hashlib
import logging
from datetime import datetime
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives import serialization

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Configuration
BACKEND_URL = "http://localhost:8001/api/v1/telemetry"
NODE_ID = "gpu-node-01"
MODEL_ID = "llama-2-70b"
POLL_INTERVAL = 1.0 # seconds

# Mock NVML if not present
try:
    import pynvml
    pynvml.nvmlInit()
    HAS_GPU = True
except ImportError:
    HAS_GPU = False
    logger.warning("pynvml not found. Running in simulation mode.")
except Exception as e:
    HAS_GPU = False
    logger.warning(f"Failed to initialize NVML: {e}. Running in simulation mode.")

class TPMStub:
    """
    Simulates a TPM for signing telemetry.
    In production, this would use tpm2-pytss to sign with the Endorsement Key.
    """
    def __init__(self):
        # Generate a software key for simulation
        self.private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
        )
        self.public_key = self.private_key.public_key()

    def sign(self, data: bytes) -> str:
        signature = self.private_key.sign(
            data,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        return signature.hex()

tpm = TPMStub()

def get_gpu_metrics():
    if HAS_GPU:
        try:
            handle = pynvml.nvmlDeviceGetHandleByIndex(0)
            power_mw = pynvml.nvmlDeviceGetPowerUsage(handle)
            util = pynvml.nvmlDeviceGetUtilizationRates(handle).gpu
            return power_mw / 1000.0, util
        except Exception as e:
            logger.error(f"Error reading GPU: {e}")
            return 0.0, 0.0
    else:
        # Simulation
        import random
        return 250.0 + random.uniform(-10, 10), random.uniform(80, 100)

def main():
    logger.info("Starting Green Compute Telemetry Agent...")
    
    current_inference_id = str(uuid.uuid4())
    energy_accumulator_kwh = 0.0
    start_time = time.time()
    
    while True:
        try:
            # 1. Poll Metrics
            power_w, util_percent = get_gpu_metrics()
            
            # 2. Integrate Energy (Riemann sum)
            # Energy (kWh) = Power (W) * Time (h) / 1000
            # We poll every POLL_INTERVAL seconds
            energy_kwh_step = (power_w * POLL_INTERVAL) / (1000.0 * 3600.0)
            energy_accumulator_kwh += energy_kwh_step
            
            # 3. Simulate Inference End (every 10 seconds for demo)
            if time.time() - start_time > 10:
                timestamp = datetime.utcnow().isoformat()
                
                payload = {
                    "node_id": NODE_ID,
                    "model_id": MODEL_ID,
                    "inference_id": current_inference_id,
                    "timestamp": timestamp,
                    "energy_kwh": energy_accumulator_kwh,
                    "gpu_utilization": util_percent,
                    "signature": "" # To be filled
                }
                
                # 4. Sign Telemetry
                # Canonicalize for signing
                payload_str = json.dumps(payload, sort_keys=True)
                signature = tpm.sign(payload_str.encode())
                payload["signature"] = signature
                
                # 5. Send to Backend
                logger.info(f"Sending telemetry for {current_inference_id}: {energy_accumulator_kwh:.6f} kWh")
                response = requests.post(BACKEND_URL, json=payload)
                
                if response.status_code == 200:
                    cert = response.json()
                    logger.info(f"Received Certificate: {cert['certificate_id']}")
                else:
                    logger.error(f"Failed to send telemetry: {response.text}")
                
                # Reset for next inference
                current_inference_id = str(uuid.uuid4())
                energy_accumulator_kwh = 0.0
                start_time = time.time()
            
            time.sleep(POLL_INTERVAL)
            
        except KeyboardInterrupt:
            logger.info("Stopping agent.")
            break
        except Exception as e:
            logger.error(f"Agent loop error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
