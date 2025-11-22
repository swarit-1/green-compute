# Architecture

## Overview

The Verifiable Green Compute Oracle is a distributed system for measuring, verifying, and attesting the carbon footprint of AI inference workloads.

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   GPU Node   │       │   Backend    │       │   Frontend   │
│              │       │   Oracle     │       │  Dashboard   │
│  ┌────────┐  │       │              │       │              │
│  │ Agent  │──┼──────▶│  FastAPI     │◀─────▶│  Next.js     │
│  └────────┘  │       │              │       │              │
│  ┌────────┐  │       │ ┌──────────┐ │       └──────────────┘
│  │TPM/TEE │  │       │ │PostgreSQL│ │
│  └────────┘  │       │ └──────────┘ │
└──────────────┘       └──────────────┘
```

## Components

### 1. Telemetry Agent (`/agent`)

**Responsibility**: Measure GPU energy consumption and sign telemetry.

**Tech Stack**:
- Python 3.11
- `pynvml` for NVIDIA GPU metrics
- `cryptography` for TPM simulation (RSA-PSS signing)

**Process Flow**:
1. Poll GPU power (watts) using NVML
2. Integrate energy over time (E = P × t)
3. On inference completion:
   - Bundle telemetry (energy, timestamp, IDs)
   - Sign with TPM private key
   - POST to Backend Oracle

**Security**:
- In production, uses hardware TPM 2.0 Endorsement Key
- Signature proves data originated from specific hardware
- Anti-replay via nonce/timestamp

---

### 2. Backend Oracle (`/backend`)

**Responsibility**: Verify telemetry, calculate emissions, issue certificates.

**Tech Stack**:
- FastAPI (async Python)
- PostgreSQL with SQLAlchemy ORM
- JWS (JSON Web Signature) for certificate signing

**API Endpoints**:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/telemetry` | Ingest signed telemetry |
| GET | `/api/v1/certificate/{inference_id}` | Retrieve certificate |
| GET | `/api/v1/certificates` | List all certificates |
| GET | `/api/v1/model/{model_id}/emissions` | Aggregate model stats |
| GET | `/api/v1/compliance/export` | Export CSV report |

**Process Flow**:
1. Receive telemetry
2. Verify TPM signature
3. Fetch carbon intensity from grid oracle (mock in v1)
4. Calculate: `emissions (gCO₂) = energy (kWh) × intensity (gCO₂/kWh)`
5. Generate certificate JSON
6. Sign with Oracle's private key (JWS)
7. Store in PostgreSQL
8. Return signed certificate

**Database Schema**:
- `nodes`: Registered GPU nodes
- `telemetry_events`: Raw signed measurements
- `certificates`: Issued Green Compute Certificates
- `attestation_records`: TPM verification logs
- `audit_logs`: All operations

---

### 3. Frontend Dashboard (`/frontend`)

**Responsibility**: Visualize emissions, browse certificates, export compliance reports.

**Tech Stack**:
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- Chart.js for real-time graphs

**Pages**:
- `/` - Dashboard with real-time stats and charts
- `/certificates` - Browse all certificates, search, export

**Features**:
- Live refresh every 5 seconds
- CSV export for compliance audits
- Search by Inference ID
- Responsive design with glassmorphism

---

## Certificate Structure

```json
{
  "certificate_id": "uuid",
  "inference_id": "unique-inference-id",
  "hardware_id": "tpm-endorsement-key-hash",
  "timestamp": "2025-11-21T08:00:00Z",
  "energy_used_kwh": 0.0025,
  "carbon_intensity_gco2_kwh": 380.5,
  "total_emissions_gco2": 0.95125,
  "issuer": "Verifiable Green Compute Oracle",
  "signature": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

The `signature` field is a JWS token that can be independently verified.

---

## Security Model

### Chain of Trust

1. **Hardware Root of Trust**: TPM 2.0 on GPU node
2. **Agent Signing**: Telemetry signed with TPM Endorsement Key
3. **Oracle Verification**: Backend verifies TPM signature
4. **Certificate Signing**: Oracle signs final certificate
5. **Public Audit**: Certificates can be verified by third parties

### Threat Model

**Protections**:
- ✅ Tampered telemetry (signature verification)
- ✅ Replay attacks (nonce + timestamp)
- ✅ Certificate forgery (JWS signing)

**Out of Scope (v1)**:
- Side-channel attacks on TPM
- Compromised Oracle key (use HSM in production)
- Byzantine fault tolerance

---

## Deployment

### Local Development
```bash
cd infra/docker
docker-compose up
```

### Production (Kubernetes)
```bash
kubectl apply -f infra/k8s/
```

### Cloud (Terraform)
```bash
cd infra/terraform
terraform init
terraform apply
```

---

## Future Enhancements

1. **Real Carbon API Integration**: WattTime, ElectricityMap
2. **Blockchain Anchoring**: Store certificate hashes on Ethereum/Polygon
3. **Verifiable Credentials**: W3C VC format
4. **Multi-region Support**: Regional carbon intensity
5. **Model Registry**: Track per-model emissions over time
6. **Compliance Standards**: ISO 14064, GHG Protocol
