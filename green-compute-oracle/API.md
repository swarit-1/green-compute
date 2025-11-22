# API Reference

Base URL: `http://localhost:8000/api/v1`

## Endpoints

### POST /telemetry

Submit signed GPU telemetry from an agent.

**Request Body**:
```json
{ 
  "node_id": "gpu-node-01",
  "model_id": "llama-2-70b",
  "inference_id": "inf-12345678",
  "timestamp": "2025-11-21T08:00:00Z",
  "energy_kwh": 0.0025,
  "gpu_utilization": 95.0,
  "signature": "hex-encoded-rsa-pss-signature"
}
```

**Response**: `200 OK`
```json
{
  "certificate_id": "cert-uuid",
  "inference_id": "inf-12345678",
  "hardware_id": "gpu-node-01",
  "timestamp": "2025-11-21T08:00:00Z",
  "energy_used_kwh": 0.0025,
  "carbon_intensity_gco2_kwh": 380.5,
  "total_emissions_gco2": 0.95125,
  "issuer": "Verifiable Green Compute Oracle",
  "signature": "jws-token"
}
```

---

### GET /certificate/{inference_id}

Retrieve a specific certificate.

**Parameters**:
- `inference_id` (path): Unique inference identifier

**Response**: `200 OK`
```json
{
  "certificate_id": "cert-uuid",
  "inference_id": "inf-12345678",
  ...
}
```

---

### GET /certificates

List all certificates with pagination.

**Query Parameters**:
- `limit` (optional, default: 100): Number of certificates to return
- `offset` (optional, default: 0): Pagination offset

**Response**: `200 OK`
```json
[
  {
    "certificate_id": "cert-uuid-1",
    "inference_id": "inf-12345678",
    ...
  },
  {
    "certificate_id": "cert-uuid-2",
    "inference_id": "inf-87654321",
    ...
  }
]
```

---

### GET /model/{model_id}/emissions

Get aggregated emissions for a specific model.

**Response**: `200 OK`
```json
{
  "model_id": "llama-2-70b",
  "total_emissions_gco2": 125.5,
  "avg_emissions_gco2": 0.95,
  "inference_count": 132
}
```

---

### GET /compliance/export

Export a CSV compliance report.

**Response**: `200 OK` (CSV file download)
```csv
Certificate ID,Inference ID,Timestamp,Energy (kWh),Carbon Intensity (gCO2/kWh),Total Emissions (gCO2),Verified
cert-uuid-1,inf-123,2025-11-21T08:00:00Z,0.0025,380.5,0.95,Yes
...
```

---

## Authentication (Future)

In production, use API keys:

```bash
curl -H "X-API-Key: your-key" http://localhost:8000/api/v1/certificates
```

---

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request payload"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid Agent Signature"
}
```

### 404 Not Found
```json
{
  "detail": "Certificate not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal error message"
}
```
