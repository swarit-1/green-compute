# Verifiable Green Compute Oracle

**Production-grade platform for cryptographically verifying the carbon footprint of AI inference workloads.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Features

✅ **GPU Telemetry Agent** - Measures energy consumption at inference-level  
✅ **Cryptographic Attestation** - TPM/TEE-signed telemetry for tamper-proof data  
✅ **Carbon Intensity Oracle** - Real-time grid carbon data integration  
✅ **Certificate Generation** - JWS-signed Green Compute Certificates  
✅ **Compliance Dashboard** - Beautiful React UI with real-time analytics  
✅ **CSV Export** - ISO 14064-compliant reporting  

---

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
cd infra/docker
docker-compose up --build
```

- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Dashboard**: http://localhost:3000

### Option 2: Manual Setup

#### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+

#### Setup

```bash
# Windows
.\scripts\setup.ps1

# Linux/Mac
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Then start each service in separate terminals:

```bash
# Terminal 1: Backend
cd backend
.\venv\Scripts\Activate.ps1  # Windows
source venv/bin/activate      # Linux/Mac
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Agent (simulation mode)
cd agent
python agent.py
```

---

## 📊 Architecture

```
┌─────────────────┐       ┌──────────────┐       ┌──────────────┐
│   GPU Node      │       │   Backend    │       │   Frontend   │
│                 │       │   Oracle     │       │  Dashboard   │
│  ┌───────────┐  │       │              │       │              │
│  │  Agent    │──┼──────▶│  FastAPI     │◀─────▶│  Next.js     │
│  └───────────┘  │ POST  │  + Postgres  │  API  │  + Tailwind  │
│  ┌───────────┐  │       │              │       │              │
│  │  TPM/TEE  │  │       │ ┌──────────┐ │       └──────────────┘
│  └───────────┘  │       │ │Carbon API│ │
└─────────────────┘       │ └──────────┘ │
                          └──────────────┘
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for details.

---

## 📖 Documentation

- **[API Reference](./API.md)** - Complete REST API documentation
- **[Architecture](./ARCHITECTURE.md)** - System design and security model
- **[Database Schema](./backend/schema.sql)** - PostgreSQL schema

---

## 🔐 Security

### Chain of Trust

1. **Hardware Root**: TPM 2.0 Endorsement Key on GPU node
2. **Agent Signing**: Telemetry signed with TPM (RSA-PSS)
3. **Oracle Verification**: Backend verifies TPM signature
4. **Certificate Signing**: Oracle issues JWS-signed certificate

All certificates can be independently verified by third parties.

---

## 🧪 Testing

```bash
cd backend
.\venv\Scripts\Activate.ps1
pytest tests/
```

---

## 📦 Production Deployment

### Kubernetes

```bash
kubectl apply -f infra/k8s/
```

### AWS (Terraform)

```bash
cd infra/terraform
terraform init
terraform apply
```

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Backend** | FastAPI, SQLAlchemy, PostgreSQL |
| **Agent** | Python, pynvml, cryptography |
| **Frontend** | Next.js 14, React 18, Tailwind CSS |
| **Infra** | Docker, Kubernetes, Terraform |
| **Crypto** | JWS (HS256), RSA-PSS, TPM 2.0 |

---

## 📊 Certificate Example

```json
{
  "certificate_id": "550e8400-e29b-41d4-a716-446655440000",
  "inference_id": "inf-12345678",
  "hardware_id": "gpu-node-01",
  "timestamp": "2025-11-21T08:00:00Z",
  "energy_used_kwh": 0.0025,
  "carbon_intensity_gco2_kwh": 380.5,
  "total_emissions_gco2": 0.95125,
  "issuer": "Verifiable Green Compute Oracle",
  "signature": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🔮 Roadmap

- [x] v1.0: Core telemetry + certificate issuance
- [ ] v1.1: WattTime / ElectricityMap integration
- [ ] v1.2: Blockchain anchoring (Ethereum/Polygon)
- [ ] v1.3: W3C Verifiable Credentials format
- [ ] v1.4: Multi-region carbon tracking
- [ ] v2.0: Model registry & analytics

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file

---

## 👥 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

---

## 🙏 Acknowledgments

Built with inspiration from:
- [Electricity Maps](https://www.electricitymaps.com/)
- [WattTime](https://www.watttime.org/)
- [ML CO2 Impact](https://mlco2.github.io/impact/)
- [Green Software Foundation](https://greensoftware.foundation/)

---

**Built for a sustainable AI future** 🌱
