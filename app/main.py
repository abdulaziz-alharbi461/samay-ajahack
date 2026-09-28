import os
import uuid
import datetime
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.models import (
    Spot, WeatherInput, ClarityScoreResponse,
    ForecastResponse, RecommendationRequest, RecommendationResponse,
    BookingInquiryRequest, BookingInquiryResponse, PlatformStats
)
from app.data_loader import DataLoader
from app.engine import StargazingEngine
from app.recommendations import RecommendationEngine

app = FastAPI(
    title="سماي | My Sky API",
    description="Predictive Astro-Tourism & Dark Sky Management Platform for Hail, Saudi Arabia",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")

# Mount static files directory
if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.get("/", include_in_schema=False)
async def serve_index():
    index_file = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "My Sky (سماي) Backend API is live. Visit /docs for OpenAPI specifications."}

# --- API Endpoints ---

@app.get("/api/stats", response_model=PlatformStats, tags=["Platform Analytics"])
def get_stats():
    """Retrieve Dark Sky Park metrics and current celestial status."""
    return DataLoader.get_platform_stats()

@app.get("/api/spots", response_model=List[Spot], tags=["Directory & Map"])
def list_spots(
    type: Optional[str] = Query(None, description="Filter by spot type: sanctuary, camp, or spot"),
    max_bortle: Optional[int] = Query(None, description="Filter by maximum Bortle class (1-5)"),
    is_camp: Optional[bool] = Query(None, description="Only certified camping accommodations"),
    has_telescopes: Optional[bool] = Query(None, description="Only sites with telescope equipment"),
    search: Optional[str] = Query(None, description="Search query across English and Arabic names")
):
    """Retrieve curated stargazing spots and camps across Hail and Al-Nafud."""
    return DataLoader.filter_spots(
        spot_type=type,
        max_bortle=max_bortle,
        is_camp=is_camp,
        has_telescopes=has_telescopes,
        search_query=search
    )

@app.get("/api/spots/{spot_id}", response_model=Spot, tags=["Directory & Map"])
def get_spot(spot_id: str):
    """Get complete details for a specific spot or certified camp."""
    spot = DataLoader.get_spot_by_id(spot_id)
    if not spot:
        raise HTTPException(status_code=404, detail="Spot not found")
    return spot

@app.get("/api/forecast/{spot_id}", response_model=ForecastResponse, tags=["Predictive Engine"])
def get_spot_forecast(spot_id: str):
    """
    Generate 7-day predictive Stargazing Clarity Index (SCI) forecast
    for a chosen location in Hail/Al-Nafud.
    """
    spot = DataLoader.get_spot_by_id(spot_id)
    if not spot:
        raise HTTPException(status_code=404, detail="Spot not found")

    # Current night calculation
    current_weather = WeatherInput(
        cloud_cover_pct=5.0,
        moon_illumination_pct=14.0,
        bortle_class=spot.bortle_class,
        humidity_pct=22.0,
        wind_speed_kmh=11.0,
        ambient_temp_c=21.0
    )
    current_clarity = StargazingEngine.calculate_sci(current_weather)
    forecast_days = StargazingEngine.generate_7day_forecast(spot.bortle_class, spot.elevation_m)

    return ForecastResponse(
        spot_id=spot.id,
        spot_name_en=spot.name_en,
        spot_name_ar=spot.name_ar,
        bortle_class=spot.bortle_class,
        sqm_value=spot.sqm_value,
        current_clarity=current_clarity,
        forecast=forecast_days
    )

@app.post("/api/calculator/sci", response_model=ClarityScoreResponse, tags=["Predictive Engine"])
def calculate_custom_sci(weather: WeatherInput):
    """
    Calculate Stargazing Clarity Index (SCI) dynamically based on custom
    meteorological & astronomical parameters.
    """
    return StargazingEngine.calculate_sci(weather)

@app.post("/api/recommend", response_model=RecommendationResponse, tags=["Smart Recommendations"])
def recommend_spots(req: RecommendationRequest):
    """
    Smart recommendation matching engine: calculates suitability scores
    and suggests optimal night and location based on user persona and requirements.
    """
    return RecommendationEngine.get_recommendations(req)

@app.post("/api/bookings/inquire", response_model=BookingInquiryResponse, tags=["Booking Simulation"])
def create_booking_inquiry(inquiry: BookingInquiryRequest):
    """
    Simulates booking inquiry and creates a direct WhatsApp connection link
    for certified camps and stargazing expeditions.
    """
    spot = DataLoader.get_spot_by_id(inquiry.spot_id)
    if not spot:
        raise HTTPException(status_code=404, detail="Spot not found")

    inquiry_id = f"INQ-{uuid.uuid4().hex[:8].upper()}"
    ref_code = f"NAFUD-{datetime.date.today().strftime('%y%m')}-{inquiry_id[-4:]}"

    total_price = spot.booking_price_sar * inquiry.num_guests
    if inquiry.requires_astrophotography_guide:
        total_price += 250 # Guided mentoring fee

    wa_phone = spot.contact_phone.replace("+", "").replace(" ", "")
    if inquiry.language == "en":
        wa_text = (
            f"Hello, I would like to inquire about booking a stargazing experience at {spot.name_en} "
            f"on {inquiry.preferred_date} for {inquiry.num_guests} guests. "
            f"Reference code: {ref_code}"
        )
    else:
        wa_text = (
            f"مرحباً، أود الاستفسار بخصوص حجز تجربة رصد فلكي في {spot.name_ar} "
            f"بتاريخ {inquiry.preferred_date} لعدد {inquiry.num_guests} أشخاص. "
            f"رقم المرجع: {ref_code}"
        )
    from urllib.parse import quote
    whatsapp_link = f"https://wa.me/{wa_phone}?text={quote(wa_text)}"

    return BookingInquiryResponse(
        inquiry_id=inquiry_id,
        status="confirmed_simulated",
        reference_code=ref_code,
        spot_name_en=spot.name_en,
        spot_name_ar=spot.name_ar,
        confirmation_message_en=f"Inquiry received successfully! Reference {ref_code}. The camp manager will confirm availability within 15 minutes.",
        confirmation_message_ar=f"تم استلام طلبكم بنجاح! رقم المرجع {ref_code}. سيتواصل معكم منسق المخيم الفلكي لتأكيد الحجز.",
        estimated_total_sar=total_price,
        whatsapp_link=whatsapp_link,
        timestamp=datetime.datetime.now().isoformat()
    )
