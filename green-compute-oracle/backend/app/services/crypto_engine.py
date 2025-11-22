from jose import jwt, jws
from datetime import datetime, timedelta
from app.core.config import settings
import hashlib
import json

class CryptoEngine:
    def __init__(self):
        self.secret = settings.SECRET_KEY
        self.algorithm = settings.ALGORITHM

    def sign_certificate(self, payload: dict) -> str:
        """
        Signs a Green Compute Certificate using JWS.
        """
        # In a real production system, this would use an HSM-backed private key (RSA/ECDSA)
        # For this v1, we use HS256 with a secret key
        token = jwt.encode(payload, self.secret, algorithm=self.algorithm)
        return token

    def verify_signature(self, token: str) -> dict:
        try:
            payload = jwt.decode(token, self.secret, algorithms=[self.algorithm])
            return payload
        except Exception as e:
            raise ValueError(f"Invalid signature: {str(e)}")

    def hash_content(self, content: dict) -> str:
        """
        Creates a canonical hash of the content
        """
        canonical_json = json.dumps(content, sort_keys=True)
        return hashlib.sha256(canonical_json.encode()).hexdigest()

    def verify_agent_signature(self, payload: dict, signature: str, public_key: str) -> bool:
        """
        Verifies the signature from the Telemetry Agent (TPM signed).
        For v1, we assume the agent signs the hash of the payload.
        """
        # Placeholder for actual TPM signature verification (e.g. using tpm2-pytss or openssl)
        # Here we just check if signature exists for the demo
        return True if signature else False

crypto_engine = CryptoEngine()
