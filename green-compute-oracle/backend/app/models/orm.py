from sqlalchemy import Column, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid
from datetime import datetime

class Node(Base):
    __tablename__ = "nodes"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hostname = Column(String, nullable=False)
    hardware_id = Column(String, unique=True, nullable=False)
    region = Column(String, nullable=False)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

class TelemetryEvent(Base):
    __tablename__ = "telemetry_events"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    node_id = Column(String(36), ForeignKey("nodes.id"))
    model_id = Column(String(36)) # Simplified for now
    inference_id = Column(String, unique=True, nullable=False)
    timestamp = Column(DateTime, nullable=False)
    energy_kwh = Column(Float, nullable=False)
    gpu_utilization = Column(Float)
    signature = Column(Text, nullable=False)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Certificate(Base):
    __tablename__ = "certificates"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    inference_id = Column(String, ForeignKey("telemetry_events.inference_id"))
    energy_used_kwh = Column(Float, nullable=False)
    carbon_intensity_gco2_kwh = Column(Float, nullable=False)
    total_emissions_gco2 = Column(Float, nullable=False)
    grid_region = Column(String, nullable=False)
    issued_at = Column(DateTime, default=datetime.utcnow)
    certificate_hash = Column(String, nullable=False)
    signed_content = Column(Text, nullable=False)
