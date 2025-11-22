-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Nodes: Registered GPU nodes
CREATE TABLE nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hostname VARCHAR(255) NOT NULL,
    hardware_id VARCHAR(255) UNIQUE NOT NULL, -- TPM Endorsement Key Hash or similar
    region VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Models: Registered AI Models
CREATE TABLE models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    owner VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- API Keys for authentication
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_hash VARCHAR(255) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    permissions VARCHAR(255) DEFAULT 'read,write',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Telemetry Events: Raw data from agents
CREATE TABLE telemetry_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES nodes(id),
    model_id UUID REFERENCES models(id),
    inference_id VARCHAR(255) UNIQUE NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    energy_kwh DOUBLE PRECISION NOT NULL,
    gpu_utilization DOUBLE PRECISION,
    signature TEXT NOT NULL, -- Agent signature
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Attestation Records: TPM/TEE verification logs
CREATE TABLE attestation_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES nodes(id),
    pcr_values JSONB,
    nonce VARCHAR(255),
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) -- 'success', 'failed'
);

-- Certificates: Green Compute Certificates
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inference_id VARCHAR(255) REFERENCES telemetry_events(inference_id),
    energy_used_kwh DOUBLE PRECISION NOT NULL,
    carbon_intensity_gco2_kwh DOUBLE PRECISION NOT NULL,
    total_emissions_gco2 DOUBLE PRECISION NOT NULL,
    grid_region VARCHAR(50) NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    certificate_hash VARCHAR(255) NOT NULL,
    signed_content TEXT NOT NULL -- JWS or VC
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(255) NOT NULL,
    actor VARCHAR(255),
    details JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
