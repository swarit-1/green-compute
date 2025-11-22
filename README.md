Green Compute – Oracle for Verifiable Sustainable AI Inference

Modern AI models are growing faster than the planet can sustainably support. While AI offers immense promise for climate adaptation and optimisation, its energy footprint is also rapidly increasing. According to the International Energy Agency (IEA), data-centres, AI workloads and crypto may drive a ~75% increase in global electricity demand by 2026. 
GitHub

Yet today, enterprises cannot distinguish:

✅ Clean (renewable-powered) inference

❌ Dirty (fossil-powered) inference
This is the “AI-Energy Paradox”.

What is Green Compute?

Green Compute is an open-source implementation of a Green Compute Oracle — a “Proof-of-Green-Inference” protocol that cryptographically attests to the real-time carbon intensity of AI inference workloads. 
GitHub

This repository houses early-stage prototypes: telemetry utilities, architectural definitions and tooling designed to evolve into a decentralised middleware protocol for verifiable sustainable AI.

Why it matters & regulatory trigger

The upcoming regulatory landscape is tightening: the EU Artificial Intelligence Act (EU AI Act) is the world’s first comprehensive AI framework — and it explicitly requires providers of General Purpose AI (GPAI) to report known or estimated energy consumption for both training and inference. 
GitHub

Until now, most reporting focused on training emissions. But inference—being recurring and often large-scale—dominates real-world costs and environmental impact. Businesses, auditors and regulators will soon demand verifiable, real-time, location-based carbon-intensity data for every inference job.

Green Compute exists precisely to help fill that gap.

Problem definition

AI workloads today suffer from three major gaps:

Lack of real-time carbon visibility
Many tools rely on annualised or regional averages—not actual grid carbon intensity at the moment of workload execution. 
GitHub

No cryptographic trust layer
Current measurement tools (e.g., CodeCarbon) may capture energy usage but cannot reliably prove:

where the workload physically ran

when it ran

what the local energy mix was at that moment

and that the measurement hasn’t been tampered with. 
GitHub

No marketplace for “green compute”
Cloud providers cannot reliably differentiate renewable-powered compute from fossil-powered; enterprises cannot confidently verify green claims; regulators cannot enforce compliance. 
GitHub

The Green Compute Oracle pipeline

The system implements a three-stage pipeline: Measure → Verify → Attest. 
GitHub

Measure (Granular Telemetry)

Side-car agents capture per-inference metrics: GPU utilisation, power draw (wattage), token-by-token compute footprint, runtime metadata.

Built with open standards (e.g., the Green Software Foundation’s SCI specification). 
GitHub

Verify (Spatiotemporal Anchoring)

A Trusted Execution Environment (TEE) or Proof-of-Physical-Work (PoPW) mechanism proves the physical location of the compute node, the timestamp of inference, and the integrity of telemetry data.

This is cross-checked with real-time grid carbon intensity APIs (e.g., Electricity Maps, WattTime). 
GitHub

Attest (On-Chain Certificate)

The system mints a verifiable credential (or dynamic NFT) capturing: energy consumption, carbon intensity, timestamp, location, and proof of measurement integrity.

Becomes an immutable audit trail for ESG reporting, regulatory filings (CSRD, EU AI Act, SEC Climate Rule), carbon-marketplace integrations. 
GitHub

Repository Structure
green-compute/
├── src/
│   ├── telemetry/        # Metric collectors and SCI-based measurement logic
│   ├── verifier/         # TEE + grid-intensity verification logic
│   ├── attestation/      # Verifiable credential minting
│   └── utils/
│       ├── examples/     # Minimal examples for instrumenting inference engines
├── specs/                # Protocol definitions, schemas, documentation
├── research/             # Whitepapers, notes, regulatory analysis
└── README.md


Note: This is still an early-stage research prototype. Modules will be reorganised as the protocol matures. 
GitHub

Architectural Diagram (High-Level)
Inference Engine (vLLM, TensorRT-LLM)
        ↓
Telemetry Side-car (GPU metrics, SCI)
        ↓
Grid Data (Carbon API)
        ↓
Trusted Verification (TEE / PoPW)
        ↓
On-Chain Attestation (Green Compute Certificate)


GitHub

Performance Philosophy

Inference workloads are latency-sensitive. Verification and attestation pipelines shouldn’t slow them down. So:

Attestation is asynchronous; inference does not block.

Certificate minting happens post-hoc, avoiding inference delay. 
GitHub

High-throughput workloads (e.g., batches) stand to gain most.

Roadmap

Phase 1 – Measurement Layer

SCI-compliant telemetry

GPU power-draw estimators & direct hardware probes

Token-level energy-measurement prototype

GitHub

Phase 2 – Verification Layer

TEE-based proof-of-location

Millisecond-level sync with grid APIs

Anti-tamper logs & hashing

GitHub

Phase 3 – Attestation Layer

Verifiable credential schema

Green Compute Certificate v1

Low-carbon chain deployment

API for enterprise ESG integration

GitHub

Who Is This For?

AI infrastructure companies

Cloud providers offering renewable-backed GPU/TPU compute

Enterprises under Net-Zero or ESG mandates

LLM / AI-Inference developers needing ESG compliance

Regulators and auditors demanding verifiable energy-data for inference

GitHub

Getting Started (Early Prototype)
git clone https://github.com/swarit-1/green-compute.git
cd green-compute
pip install -r requirements.txt


⚠️ Current prototype includes experimental measurement and verification modules — not production-ready. 
GitHub
