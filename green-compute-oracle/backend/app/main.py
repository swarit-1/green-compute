from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import telemetry, certificates, verifiable_credentials
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(telemetry.router, prefix=settings.API_V1_STR, tags=["telemetry"])
app.include_router(certificates.router, prefix=settings.API_V1_STR, tags=["certificates"])
app.include_router(verifiable_credentials.router, prefix=settings.API_V1_STR, tags=["verifiable-credentials"])

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
