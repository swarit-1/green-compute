from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Allow running without database for demo
try:
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URI, pool_pre_ping=True)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    DB_AVAILABLE = True
except Exception as e:
    print(f"⚠️  Database not available: {e}")
    print("Running in DEMO mode without persistence")
    SessionLocal = None
    engine = None
    DB_AVAILABLE = False

Base = declarative_base()

def get_db():
    if not DB_AVAILABLE or SessionLocal is None:
        # Return None for demo mode
        yield None
        return
    
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
