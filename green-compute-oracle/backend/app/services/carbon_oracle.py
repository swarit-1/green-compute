import httpx
from datetime import datetime
from app.models.schemas import CarbonIntensityResponse
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class WattTimeClient:
    """
    WattTime API integration for real-time grid carbon intensity.
    Free tier: https://www.watttime.org/api-documentation/#register-new-user
    """
    
    def __init__(self, username: str = "", password: str = ""):
        self.base_url = "https://api2.watttime.org/v2"
        self.username = username or "demo"  # Use demo for testing
        self.password = password or "demo"
        self.token = None
        
    async def _get_token(self) -> Optional[str]:
        """Authenticate and get access token"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/login",
                    auth=(self.username, self.password),
                    timeout=10.0
                )
                if response.status_code == 200:
                    self.token = response.json().get("token")
                    return self.token
                else:
                    logger.error(f"WattTime auth failed: {response.status_code}")
                    return None
        except Exception as e:
            logger.error(f"WattTime auth error: {e}")
            return None
    
    async def get_intensity_by_region(self, region: str) -> Optional[float]:
        """
        Get current carbon intensity for a region.
        Region codes: https://www.watttime.org/api-documentation/#list-of-grid-regions
        """
        if not self.token:
            await self._get_token()
        
        if not self.token:
            logger.warning("No WattTime token, using fallback")
            return None
            
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/index",
                    params={"ba": region},
                    headers={"Authorization": f"Bearer {self.token}"},
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    # WattTime returns a 0-100 index, convert to gCO2/kWh
                    # Average US grid: ~400 gCO2/kWh at index 50
                    moer_index = data.get("percent", 50)
                    # Scale: 0% = 50 gCO2/kWh (clean), 100% = 800 gCO2/kWh (dirty)
                    intensity = 50 + (moer_index * 7.5)
                    return intensity
                    
        except Exception as e:
            logger.error(f"WattTime API error: {e}")
            return None

class ElectricityMapsClient:
    """
    Electricity Maps API integration (alternative to WattTime)
    Free tier: https://api-portal.electricitymaps.com/
    """
    
    def __init__(self, api_key: str = ""):
        self.base_url = "https://api.electricitymap.org/v3"
        self.api_key = api_key
    
    async def get_intensity_by_zone(self, zone: str) -> Optional[float]:
        """
        Get carbon intensity for a zone.
        Zone codes: https://api.electricitymap.org/v3/zones
        Examples: US-CAL-CISO, DE, FR, GB
        """
        if not self.api_key:
            logger.warning("No Electricity Maps API key")
            return None
            
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/carbon-intensity/latest",
                    params={"zone": zone},
                    headers={"auth-token": self.api_key},
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    return data.get("carbonIntensity", None)
                    
        except Exception as e:
            logger.error(f"Electricity Maps API error: {e}")
            return None

class CarbonOracle:
    """Enhanced Carbon Oracle with real-time API integration"""
    
    def __init__(self, watttime_user: str = "", watttime_pass: str = "", emaps_key: str = ""):
        self.watttime = WattTimeClient(watttime_user, watttime_pass)
        self.emaps = ElectricityMapsClient(emaps_key)
        
        # Fallback regional averages (US EPA 2023 data)
        self.regional_fallbacks = {
            "us-east": 380.5,      # US East (mix of coal, gas, nuclear)
            "us-west": 245.3,      # US West (more hydro/renewables)
            "us-midwest": 520.8,   # US Midwest (coal-heavy)
            "us-texas": 412.6,     # ERCOT (gas-heavy)
            "eu-central": 295.4,   # EU Central (Germany mix)
            "eu-north": 45.2,      # Nordic (high hydro/wind)
            "eu-west": 210.6,      # EU West (France nuclear)
            "asia-east": 641.2,    # East Asia (coal-heavy)
            "default": 429.0       # Global average
        }
    
    async def get_intensity(self, region: str) -> CarbonIntensityResponse:
        """
        Get carbon intensity with cascading fallback:
        1. Try WattTime
        2. Try Electricity Maps
        3. Use regional fallback
        """
        intensity = None
        source = "fallback"
        
        # Try WattTime first (US regions)
        if region.startswith("us-"):
            watttime_region = self._map_to_watttime_ba(region)
            intensity = await self.watttime.get_intensity_by_region(watttime_region)
            if intensity:
                source = "watttime"
        
        # Try Electricity Maps (global)
        if not intensity:
            emaps_zone = self._map_to_emaps_zone(region)
            intensity = await self.emaps.get_intensity_by_zone(emaps_zone)
            if intensity:
                source = "electricitymaps"
        
        # Fallback to regional average
        if not intensity:
            intensity = self.regional_fallbacks.get(region, self.regional_fallbacks["default"])
            source = "regional_average"
        
        logger.info(f"Carbon intensity for {region}: {intensity:.2f} gCO2/kWh (source: {source})")
        
        return CarbonIntensityResponse(
            region=region,
            intensity=intensity,
            timestamp=datetime.utcnow(),
            source=source  # Add source tracking
        )
    
    def _map_to_watttime_ba(self, region: str) -> str:
        """Map our region codes to WattTime Balancing Authority codes"""
        mapping = {
            "us-east": "PJM",          # PJM Interconnection
            "us-west": "CAISO",        # California ISO
            "us-midwest": "MISO",      # Midcontinent ISO
            "us-texas": "ERCO",        # ERCOT
        }
        return mapping.get(region, "PJM")
    
    def _map_to_emaps_zone(self, region: str) -> str:
        """Map our region codes to Electricity Maps zone codes"""
        mapping = {
            "us-east": "US-NY",
            "us-west": "US-CAL-CISO",
            "us-midwest": "US-MIDW-MISO",
            "us-texas": "US-TEX-ERCO",
            "eu-central": "DE",
            "eu-north": "SE",
            "eu-west": "FR",
        }
        return mapping.get(region, "US-NY")

# Global instance
carbon_oracle = CarbonOracle()
