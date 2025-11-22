"""
Database initialization script for Green Compute Oracle
Creates all tables in SQLite
"""
from app.models.orm import Base
from app.core.database import engine
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_db():
    """Initialize the database with all tables"""
    try:
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully!")
    except Exception as e:
        logger.error(f"❌ Failed to create database tables: {e}")
        raise

if __name__ == "__main__":
    init_db()
