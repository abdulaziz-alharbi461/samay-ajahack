import datetime
import math
from typing import List, Dict, Any
from app.models import WeatherInput, ClarityScoreResponse, SubScores, DayForecast

class StargazingEngine:
    """
    Algorithmic engine for calculating the Stargazing Clarity Index (SCI)
    and synthesizing multi-night predictive astro-forecasts for Hail & Al-Nafud.
    """

    @staticmethod
    def calculate_sci(weather: WeatherInput) -> ClarityScoreResponse:
        """
        Calculates Stargazing Clarity Index (1.0 to 10.0) based on multi-parameter atmospheric physics.
        """
        # 1. Cloud Score (Weight 40%) - Exponential drop-off as clouds obstruct view
        cloud_pct = max(0.0, min(100.0, weather.cloud_cover_pct))
        if cloud_pct <= 5.0:
            cloud_score = 10.0
        elif cloud_pct <= 20.0:
            cloud_score = 10.0 - (cloud_pct - 5.0) * 0.15 # 7.75 - 10.0
        elif cloud_pct <= 50.0:
            cloud_score = 7.75 - (cloud_pct - 20.0) * 0.15 # 3.25 - 7.75
        else:
            cloud_score = max(1.0, 3.25 - (cloud_pct - 50.0) * 0.045)

        # 2. Moon Score (Weight 25%) - Lunar illumination washes out faint stars & nebulae
        moon_pct = max(0.0, min(100.0, weather.moon_illumination_pct))
        # New moon (0-10%) = 10.0 to 9.5; Full moon (90-100%) = 2.0 to 1.0
        moon_score = max(1.0, 10.0 - (moon_pct / 100.0) * 8.5)

        # 3. Darkness / Bortle Score (Weight 18%)
        bortle_map = {
            1: 10.0, # Truly dark skies (Al-Nafud Core Sanctuary, Shuwaymis)
            2: 8.8,  # Typical truly dark site (Jubbah, Al-Ghadah)
            3: 7.2,  # Rural sky (Jabal Aja lookout)
            4: 5.2,  # Rural/suburban transition
            5: 3.5   # Suburban
        }
        darkness_score = bortle_map.get(weather.bortle_class, 7.0)

        # 4. Transparency / Humidity Score (Weight 10%)
        # In desert climates, 10% to 35% humidity is ideal. >60% causes condensation & aerosol scattering.
        humidity = max(0.0, min(100.0, weather.humidity_pct))
        if humidity <= 35.0:
            transparency_score = 10.0
        elif humidity <= 60.0:
            transparency_score = 10.0 - (humidity - 35.0) * 0.16 # 6.0 to 10.0
        else:
            transparency_score = max(2.0, 6.0 - (humidity - 60.0) * 0.10)

        # 5. Seeing / Wind Score (Weight 7%)
        # Wind > 25 km/h causes telescope vibration and lifts desert dust.
        wind = max(0.0, weather.wind_speed_kmh)
        if wind <= 15.0:
            seeing_score = 10.0
        elif wind <= 25.0:
            seeing_score = 10.0 - (wind - 15.0) * 0.25 # 7.5 to 10.0
        elif wind <= 40.0:
            seeing_score = max(3.0, 7.5 - (wind - 25.0) * 0.3)
        else:
            seeing_score = 2.0

        # Weighted aggregate calculation
        raw_sci = (
            cloud_score * 0.40 +
            moon_score * 0.25 +
            darkness_score * 0.18 +
            transparency_score * 0.10 +
            seeing_score * 0.07
        )

        # Severe cloud penalty: if cloud > 75%, score cannot exceed 3.5 regardless of dark sky
        if cloud_pct >= 75.0:
            raw_sci = min(raw_sci, 3.2)
        elif cloud_pct >= 50.0:
            raw_sci = min(raw_sci, 5.4)

        overall_score = round(max(1.0, min(10.0, raw_sci)), 1)

        # Rating tier
        if overall_score >= 8.5:
            rating_label_en = "Exceptional Stargazing"
            rating_label_ar = "سماء استثنائية وظروف مثالية"
            rating_color = "#0284C7" # Celestial sky blue
        elif overall_score >= 7.0:
            rating_label_en = "Great Observation Night"
            rating_label_ar = "ليلة ممتازة للرصد والتصوير"
            rating_color = "#06B6D4" # Cyan
        elif overall_score >= 5.0:
            rating_label_en = "Moderate Conditions"
            rating_label_ar = "ظروف رصد مقبولة"
            rating_color = "#F59E0B" # Amber
        else:
            rating_label_en = "Unfavorable Skies"
            rating_label_ar = "سماء غير ملائمة للرصد"
            rating_color = "#EF4444" # Red

        # Calculate Naked-Eye Limiting Magnitude (NELM)
        # Base magnitude up to 7.6 for Bortle 1 under zero moon & clouds
        nelm = 7.7 - (0.45 * (weather.bortle_class - 1)) - (2.3 * (moon_pct / 100.0)) - (3.2 * (cloud_pct / 100.0))
        nelm = round(max(2.5, min(7.7, nelm)), 2)

        # Milky Way visibility synthesis
        if overall_score >= 8.5 and weather.bortle_class <= 2:
            milky_way_visibility = "Blazing Galactic Core (High Contrast & Dark Rifts Visible)"
            milky_way_visibility_ar = "مركز مجرة درب التبانة متوهج بتفاصيل مذهلة والصدوع الغبارية واضحة"
        elif overall_score >= 7.0:
            milky_way_visibility = "Clearly Visible with Distinct Arch Structure"
            milky_way_visibility_ar = "شريط المجرة مرئي بوضوح وقوس المجرة مميز"
        elif overall_score >= 5.0:
            milky_way_visibility = "Faintly Visible Near Zenith"
            milky_way_visibility_ar = "مرئي بخفوت باتجاه كبد السماء"
        else:
            milky_way_visibility = "Obscured / Washed Out"
            milky_way_visibility_ar = "محجوب بسبب السحب أو الإضاءة القمرية"

        # Best viewing window recommendation
        if moon_pct <= 25.0:
            best_viewing_window = "21:30 - 04:15 AST (All-Night Dark Window)"
            best_viewing_window_ar = "21:30 - 04:15 بتوقيت السعودية (نافذة رصد مظلمة طوال الليل)"
        elif moon_pct <= 65.0:
            best_viewing_window = "23:45 - 04:30 AST (After Moonset)"
            best_viewing_window_ar = "23:45 - 04:30 بتوقيت السعودية (بعد غروب القمر)"
        else:
            best_viewing_window = "03:15 - 04:45 AST (Brief Astronomical Twilight Window)"
            best_viewing_window_ar = "03:15 - 04:45 بتوقيت السعودية (نافذة الفجر الفلكي المقتضبة)"

        # Highlights & practical tips
        highlights_en = [
            f"NELM: Limiting Magnitude {nelm} (Fine star detail visible)",
            f"Bortle Class {weather.bortle_class} Sky Darkness",
            "Optimal stability for high-magnification deep sky astrophotography" if wind <= 15 else "Slight breeze; steady tripod advised"
        ]
        highlights_ar = [
            f"القدر النجمي المرئي: {nelm} (تفاصيل دقيقة للنجوم الخافتة)",
            f"فئة الظلام الفلكي: بورتل {weather.bortle_class}",
            "استقرار هوائي ممتاز ومثالي للتعريض الطويل والتصوير الفلكي" if wind <= 15 else "هبوب نسيم خفيف؛ ينصح بتثبيت الحامل الثلاثي جيداً"
        ]

        tips_en = [
            "Allow 20-30 minutes for complete human eye dark adaptation.",
            "Use only red-light flashlights to preserve night vision.",
            "Dress warmly: Al-Nafud desert temperatures can drop rapidly after midnight."
        ]
        tips_ar = [
            "امنح عينيك من 20 إلى 30 دقيقة للتكيف التام مع ظلام الصحراء.",
            "استخدم إضاءة حمراء خافتة فقط للمحافظة على الرؤية الليلية الحساسة.",
            "احرص على ارتداء ملابس دافئة: تنخفض حرارة صحراء النفود بشكل ملحوظ بعد منتصف الليل."
        ]

        sub_scores = SubScores(
            cloud_score=round(cloud_score, 1),
            moon_score=round(moon_score, 1),
            darkness_score=round(darkness_score, 1),
            transparency_score=round(transparency_score, 1),
            seeing_score=round(seeing_score, 1)
        )

        return ClarityScoreResponse(
            overall_score=overall_score,
            rating_label_en=rating_label_en,
            rating_label_ar=rating_label_ar,
            rating_color=rating_color,
            sub_scores=sub_scores,
            naked_eye_limiting_mag=nelm,
            milky_way_visibility=milky_way_visibility,
            milky_way_visibility_ar=milky_way_visibility_ar,
            best_viewing_window=best_viewing_window,
            best_viewing_window_ar=best_viewing_window_ar,
            astronomical_highlights=highlights_en,
            astronomical_highlights_ar=highlights_ar,
            tips_en=tips_en,
            tips_ar=tips_ar
        )

    @classmethod
    def generate_7day_forecast(cls, spot_bortle: int, base_elevation: int = 850) -> List[DayForecast]:
        """
        Generates a realistic 7-day predictive astro-meteorological forecast
        tailored to Hail and Al-Nafud region.
        """
        days_en = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        days_ar = ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"]

        # Synthetic realistic weather progression for desert autumn
        weather_seeds = [
            {"cloud": 4, "moon_illum": 12, "phase_en": "Waxing Crescent", "phase_ar": "هلال متزايد", "temp": 21, "wind": 10},
            {"cloud": 2, "moon_illum": 20, "phase_en": "Waxing Crescent", "phase_ar": "هلال متزايد", "temp": 20, "wind": 12},
            {"cloud": 8, "moon_illum": 30, "phase_en": "First Quarter", "phase_ar": "تربيع أول", "temp": 19, "wind": 15},
            {"cloud": 15, "moon_illum": 42, "phase_en": "Waxing Gibbous", "phase_ar": "أحدب متزايد", "temp": 18, "wind": 14},
            {"cloud": 5, "moon_illum": 54, "phase_en": "Waxing Gibbous", "phase_ar": "أحدب متزايد", "temp": 19, "wind": 11},
            {"cloud": 1, "moon_illum": 66, "phase_en": "Waxing Gibbous", "phase_ar": "أحدب متزايد", "temp": 20, "wind": 9},
            {"cloud": 22, "moon_illum": 78, "phase_en": "Waxing Gibbous", "phase_ar": "أحدب متزايد", "temp": 18, "wind": 18},
        ]

        today = datetime.date.today()
        forecast_list: List[DayForecast] = []

        for i in range(7):
            forecast_date = today + datetime.timedelta(days=i)
            day_idx = forecast_date.weekday()
            seed = weather_seeds[i % len(weather_seeds)]

            weather_input = WeatherInput(
                cloud_cover_pct=seed["cloud"],
                moon_illumination_pct=seed["moon_illum"],
                bortle_class=spot_bortle,
                humidity_pct=22.0 + (i * 2.1) % 15,
                wind_speed_kmh=seed["wind"],
                ambient_temp_c=seed["temp"]
            )
            clarity = cls.calculate_sci(weather_input)

            if clarity.overall_score >= 8.5:
                mw_en = "Pristine Milky Way Core"
                mw_ar = "قلب المجرة ناصع وشديد الوضوح"
            elif clarity.overall_score >= 7.0:
                mw_en = "High Quality Arch"
                mw_ar = "قوس مجري عالي التباين"
            else:
                mw_en = "Faint/Moderate Visibility"
                mw_ar = "رؤية متوسطة أو خافتة"

            day_obj = DayForecast(
                date=forecast_date.strftime("%Y-%m-%d"),
                day_name_en=days_en[day_idx],
                day_name_ar=days_ar[day_idx],
                sci_score=clarity.overall_score,
                rating_label_en=clarity.rating_label_en,
                rating_label_ar=clarity.rating_label_ar,
                rating_color=clarity.rating_color,
                moon_phase_name_en=seed["phase_en"],
                moon_phase_name_ar=seed["phase_ar"],
                moon_illumination_pct=seed["moon_illum"],
                cloud_cover_pct=seed["cloud"],
                temp_c=seed["temp"],
                wind_kmh=seed["wind"],
                best_viewing_window=clarity.best_viewing_window,
                best_viewing_window_ar=clarity.best_viewing_window_ar,
                milky_way_quality=mw_en,
                milky_way_quality_ar=mw_ar
            )
            forecast_list.append(day_obj)

        return forecast_list
