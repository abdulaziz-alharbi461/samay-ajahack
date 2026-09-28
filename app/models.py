from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class SpotType(str, Enum):
    SANCTUARY = "sanctuary"
    CAMP = "camp"
    SPOT = "spot"

class Spot(BaseModel):
    id: str
    name_en: str
    name_ar: str
    type: SpotType
    category: str
    royal_reserve: Optional[str] = None
    royal_reserve_ar: Optional[str] = None
    bortle_class: int
    sqm_value: float
    latitude: float
    longitude: float
    elevation_m: int
    distance_from_hail_km: int
    access_difficulty: str
    access_difficulty_ar: str
    description_en: str
    description_ar: str
    amenities: List[str]
    amenities_ar: List[str]
    highlights: List[str]
    highlights_ar: List[str]
    image_url: str
    contact_phone: str
    booking_price_sar: int
    is_camp: bool
    has_telescopes: bool

class WeatherInput(BaseModel):
    cloud_cover_pct: float = Field(..., ge=0, le=100, description="Cloud cover percentage (0-100%)")
    moon_illumination_pct: float = Field(..., ge=0, le=100, description="Moon illumination percentage (0-100%)")
    bortle_class: int = Field(default=1, ge=1, le=5, description="Bortle light pollution class (1-5)")
    humidity_pct: float = Field(default=25.0, ge=0, le=100, description="Relative humidity percentage (0-100%)")
    wind_speed_kmh: float = Field(default=12.0, ge=0, le=120, description="Wind speed in km/h")
    ambient_temp_c: float = Field(default=21.0, description="Ambient temperature in Celsius")

class SubScores(BaseModel):
    cloud_score: float
    moon_score: float
    darkness_score: float
    transparency_score: float
    seeing_score: float

class ClarityScoreResponse(BaseModel):
    overall_score: float
    rating_label_en: str
    rating_label_ar: str
    rating_color: str
    sub_scores: SubScores
    naked_eye_limiting_mag: float
    milky_way_visibility: str
    milky_way_visibility_ar: str
    best_viewing_window: str
    best_viewing_window_ar: Optional[str] = None
    astronomical_highlights: List[str]
    astronomical_highlights_ar: List[str]
    tips_en: List[str]
    tips_ar: List[str]

class DayForecast(BaseModel):
    date: str
    day_name_en: str
    day_name_ar: str
    sci_score: float
    rating_label_en: str
    rating_label_ar: str
    rating_color: str
    moon_phase_name_en: str
    moon_phase_name_ar: str
    moon_illumination_pct: int
    cloud_cover_pct: int
    temp_c: int
    wind_kmh: int
    best_viewing_window: str
    best_viewing_window_ar: Optional[str] = None
    milky_way_quality: str
    milky_way_quality_ar: str

class ForecastResponse(BaseModel):
    spot_id: str
    spot_name_en: str
    spot_name_ar: str
    bortle_class: int
    sqm_value: float
    current_clarity: ClarityScoreResponse
    forecast: List[DayForecast]

class PersonaType(str, Enum):
    ASTROPHOTOGRAPHER = "astrophotographer"
    FAMILY = "family"
    DEEP_SKY = "deep_sky"
    ROMANTIC = "romantic"
    ADVENTURER = "adventurer"

class RecommendationRequest(BaseModel):
    persona: PersonaType = PersonaType.ASTROPHOTOGRAPHER
    requires_accommodation: bool = False
    requires_telescope: bool = False
    max_travel_distance_km: Optional[int] = 200
    experience_level: str = "intermediate"

class RecommendedSpotItem(BaseModel):
    spot: Spot
    suitability_score: int
    match_reasons_en: List[str]
    match_reasons_ar: List[str]
    best_suggested_night_en: str
    best_suggested_night_ar: str
    predicted_sci: float

class RecommendationResponse(BaseModel):
    persona: str
    persona_title_en: str
    persona_title_ar: str
    recommendations: List[RecommendedSpotItem]
    astronomy_tip_en: str
    astronomy_tip_ar: str

class BookingInquiryRequest(BaseModel):
    spot_id: str
    full_name: str
    email: str
    phone: str
    num_guests: int = 2
    preferred_date: str
    has_own_telescope: bool = False
    requires_astrophotography_guide: bool = False
    language: Optional[str] = "ar"
    notes: Optional[str] = None

class BookingInquiryResponse(BaseModel):
    inquiry_id: str
    status: str
    reference_code: str
    spot_name_en: str
    spot_name_ar: str
    confirmation_message_en: str
    confirmation_message_ar: str
    estimated_total_sar: int
    whatsapp_link: str
    timestamp: str

class PlatformStats(BaseModel):
    total_spots: int
    certified_camps: int
    dark_sky_sqm_max: float
    bortle_1_sites_count: int
    park_area_sqkm: int
    active_meteor_shower: str
    active_meteor_shower_ar: str
    lunar_cycle_stage_en: str
    lunar_cycle_stage_ar: str
