import unittest
import os
import sys

# Ensure scratch/sama-alnafud is in sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from app.models import WeatherInput, PersonaType, RecommendationRequest, BookingInquiryRequest
from app.data_loader import DataLoader
from app.engine import StargazingEngine
from app.recommendations import RecommendationEngine
from fastapi.testclient import TestClient
from app.main import app

class TestSamaAlNafud(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_data_loader(self):
        spots = DataLoader.get_all_spots()
        self.assertGreaterEqual(len(spots), 8)
        spot_ids = [s.id for s in spots]
        self.assertIn("ksrnr-khunfah-sanctuary", spot_ids)
        self.assertIn("jubbah-ghadha-camp", spot_ids)
        self.assertIn("al-rassifa-ksrnr-domes", spot_ids)

        # Test filtering
        camps = DataLoader.filter_spots(is_camp=True)
        for c in camps:
            self.assertTrue(c.is_camp)

        bortle1 = DataLoader.filter_spots(max_bortle=1)
        for b in bortle1:
            self.assertEqual(b.bortle_class, 1)

        search_res = DataLoader.filter_spots(search_query="جبة")
        self.assertGreaterEqual(len(search_res), 1)

    def test_stargazing_engine_perfect_conditions(self):
        weather = WeatherInput(
            cloud_cover_pct=0.0,
            moon_illumination_pct=0.0,
            bortle_class=1,
            humidity_pct=15.0,
            wind_speed_kmh=8.0
        )
        res = StargazingEngine.calculate_sci(weather)
        self.assertGreaterEqual(res.overall_score, 9.0)
        self.assertLessEqual(res.overall_score, 10.0)
        self.assertIn("Exceptional", res.rating_label_en)
        self.assertGreater(res.naked_eye_limiting_mag, 7.0)

    def test_stargazing_engine_poor_conditions(self):
        weather = WeatherInput(
            cloud_cover_pct=95.0,
            moon_illumination_pct=100.0,
            bortle_class=4,
            humidity_pct=85.0,
            wind_speed_kmh=45.0
        )
        res = StargazingEngine.calculate_sci(weather)
        self.assertLessEqual(res.overall_score, 3.5)
        self.assertIn("Unfavorable", res.rating_label_en)

    def test_7day_forecast(self):
        forecast = StargazingEngine.generate_7day_forecast(spot_bortle=1, base_elevation=890)
        self.assertEqual(len(forecast), 7)
        for day in forecast:
            self.assertGreaterEqual(day.sci_score, 1.0)
            self.assertLessEqual(day.sci_score, 10.0)
            self.assertTrue(day.day_name_en)
            self.assertTrue(day.day_name_ar)

    def test_recommendation_engine(self):
        # Test Astrophotographer preference
        req_astro = RecommendationRequest(
            persona=PersonaType.ASTROPHOTOGRAPHER,
            requires_accommodation=False,
            requires_telescope=False
        )
        resp_astro = RecommendationEngine.get_recommendations(req_astro)
        self.assertGreater(len(resp_astro.recommendations), 0)
        # Top recommendation should have high suitability and be Bortle 1 or 2
        top_spot = resp_astro.recommendations[0].spot
        self.assertIn(top_spot.bortle_class, [1, 2])

        # Test Family preference
        req_family = RecommendationRequest(
            persona=PersonaType.FAMILY,
            requires_accommodation=True,
            requires_telescope=True
        )
        resp_family = RecommendationEngine.get_recommendations(req_family)
        self.assertTrue(resp_family.recommendations[0].spot.is_camp)

    def test_api_endpoints(self):
        # 1. Stats endpoint
        res_stats = self.client.get("/api/stats")
        self.assertEqual(res_stats.status_code, 200)
        data_stats = res_stats.json()
        self.assertEqual(data_stats["total_spots"], 9)

        # 2. Spots list
        res_spots = self.client.get("/api/spots")
        self.assertEqual(res_spots.status_code, 200)
        self.assertEqual(len(res_spots.json()), 9)

        # 3. Forecast endpoint
        res_fc = self.client.get("/api/forecast/ksrnr-khunfah-sanctuary")
        self.assertEqual(res_fc.status_code, 200)
        data_fc = res_fc.json()
        self.assertEqual(len(data_fc["forecast"]), 7)

        # 4. Custom calculator
        res_calc = self.client.post("/api/calculator/sci", json={
            "cloud_cover_pct": 10.0,
            "moon_illumination_pct": 15.0,
            "bortle_class": 1,
            "humidity_pct": 20.0,
            "wind_speed_kmh": 10.0
        })
        self.assertEqual(res_calc.status_code, 200)
        self.assertGreater(res_calc.json()["overall_score"], 8.0)

        # 5. Recommendation endpoint
        res_rec = self.client.post("/api/recommend", json={
            "persona": "romantic",
            "requires_accommodation": True
        })
        self.assertEqual(res_rec.status_code, 200)
        self.assertGreater(len(res_rec.json()["recommendations"]), 0)

        # 6. Booking Inquiry endpoint
        res_book = self.client.post("/api/bookings/inquire", json={
            "spot_id": "jubbah-ghadha-camp",
            "full_name": "Rakan Al-Haili",
            "email": "rakan@example.com",
            "phone": "+966 50 111 2233",
            "num_guests": 2,
            "preferred_date": "2026-09-15",
            "has_own_telescope": True,
            "requires_astrophotography_guide": True
        })
        self.assertEqual(res_book.status_code, 200)
        data_book = res_book.json()
        self.assertIn("NAFUD-", data_book["reference_code"])
        self.assertIn("https://wa.me/", data_book["whatsapp_link"])

if __name__ == "__main__":
    unittest.main()
