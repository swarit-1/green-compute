from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Verifiable Green Compute Oracle"
    API_V1_STR: str = "/api/v1"
    
    # Database - defaults to SQLite for easy setup
    DATABASE_TYPE: str = "sqlite"  # or "postgres"
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "changeme"
    POSTGRES_DB: str = "green_compute"
    
    # SQLite as fallback
    SQLITE_DB_PATH: str = "green_compute.db"
    
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.DATABASE_TYPE == "postgres":
            return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"
        else:
            return f"sqlite:///{self.SQLITE_DB_PATH}"

    # Security
    SECRET_KEY: str = "super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    
    # External APIs
    CARBON_INTENSITY_API_KEY: str = "mock-key"
    
    # Signing
    PRIVATE_KEY_PATH: str = "/app/keys/private.pem"

    class Config:
        case_sensitive = True

settings = Settings()
