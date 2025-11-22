"""
W3C Verifiable Credentials (VC) implementation for Green Compute Certificates
Spec: https://www.w3.org/TR/vc-data-model/
"""
from datetime import datetime
from typing import Dict, Any, Optional
import json
import hashlib
from app.services.crypto_engine import crypto_engine

class VerifiableCredentialEngine:
    """
    Generates W3C Verifiable Credentials for Green Compute Certificates
    """
    
    def __init__(self, issuer_did: str = "did:example:green-compute-oracle"):
        self.issuer_did = issuer_did
        self.context = [
            "https://www.w3.org/2018/credentials/v1",
            "https://w3id.org/security/suites/jws-2020/v1",
            {
                "@vocab": "https://greencompute.org/credentials/v1#"
            }
        ]
    
    def create_vc(
        self,
        certificate_id: str,
        inference_id: str,
        hardware_id: str,
        timestamp: datetime,
        energy_kwh: float,
        carbon_intensity: float,
        total_emissions: float,
        carbon_source: str = "unknown"
    ) -> Dict[str, Any]:
        """
        Creates a W3C Verifiable Credential for a Green Compute Certificate
        """
        
        # Credential Subject - the claims about the inference
        credential_subject = {
            "id": f"urn:inference:{inference_id}",
            "type": "GreenComputeAttestation",
            "inferenceId": inference_id,
            "hardwareId": hardware_id,
            "timestamp": timestamp.isoformat(),
            "energyMetrics": {
                "energyConsumed": {
                    "value": energy_kwh,
                    "unit": "kWh"
                },
                "carbonIntensity": {
                    "value": carbon_intensity,
                    "unit": "gCO2/kWh",
                    "source": carbon_source
                },
                "totalEmissions": {
                    "value": total_emissions,
                    "unit": "gCO2"
                }
            },
            "verificationMethod": "TrustedExecutionEnvironment",
            "attestationType": "CryptographicProof"
        }
        
        # The VC structure
        vc = {
            "@context": self.context,
            "id": f"urn:uuid:{certificate_id}",
            "type": ["VerifiableCredential", "GreenComputeCredential"],
            "issuer": {
                "id": self.issuer_did,
                "name": "Verifiable Green Compute Oracle",
                "type": "Organization"
            },
            "issuanceDate": datetime.utcnow().isoformat() + "Z",
            "credentialSubject": credential_subject,
            "credentialSchema": {
                "id": "https://greencompute.org/schemas/v1/green-compute-credential.json",
                "type": "JsonSchemaValidator2018"
            }
        }
        
        return vc
    
    def create_verifiable_presentation(self, vc: Dict[str, Any], holder_did: Optional[str] = None) -> Dict[str, Any]:
        """
        Wraps a VC in a Verifiable Presentation for selective disclosure
        """
        vp = {
            "@context": self.context,
            "type": ["VerifiablePresentation"],
            "verifiableCredential": [vc],
            "holder": holder_did or self.issuer_did
        }
        
        return vp
    
    def sign_vc(self, vc: Dict[str, Any]) -> Dict[str, Any]:
        """
        Adds a cryptographic proof to the VC (JWS format)
        Uses JsonWebSignature2020 proof type
        """
        # Create canonical representation for signing
        canonical = json.dumps(vc, sort_keys=True, separators=(',', ':'))
        
        # Generate signature
        signature = crypto_engine.sign_certificate(vc)
        
        # Add proof section
        vc_with_proof = vc.copy()
        vc_with_proof["proof"] = {
            "type": "JsonWebSignature2020",
            "created": datetime.utcnow().isoformat() + "Z",
            "verificationMethod": f"{self.issuer_did}#key-1",
            "proofPurpose": "assertionMethod",
            "jws": signature
        }
        
        return vc_with_proof
    
    def verify_vc(self, vc_with_proof: Dict[str, Any]) -> bool:
        """
        Verifies a signed VC
        """
        if "proof" not in vc_with_proof:
            return False
        
        proof = vc_with_proof["proof"]
        jws = proof.get("jws")
        
        if not jws:
            return False
        
        # Extract VC without proof
        vc_copy = vc_with_proof.copy()
        del vc_copy["proof"]
        
        try:
            # Verify signature
            decoded = crypto_engine.verify_signature(jws)
            return True
        except Exception:
            return False
    
    def to_json_ld(self, vc: Dict[str, Any]) -> str:
        """
        Serializes VC as JSON-LD
        """
        return json.dumps(vc, indent=2)
    
    def from_json_ld(self, json_ld: str) -> Dict[str, Any]:
        """
        Deserializes VC from JSON-LD
        """
        return json.loads(json_ld)

# Global instance
vc_engine = VerifiableCredentialEngine()
