from typing import List
from app.models import (
    RecommendationRequest, RecommendationResponse, RecommendedSpotItem,
    PersonaType, Spot
)
from app.data_loader import DataLoader
from app.engine import StargazingEngine

class RecommendationEngine:
    @classmethod
    def get_recommendations(cls, req: RecommendationRequest) -> RecommendationResponse:
        spots = DataLoader.get_all_spots()
        scored_items: List[RecommendedSpotItem] = []

        persona_meta = {
            PersonaType.ASTROPHOTOGRAPHER: {
                "title_en": "Deep-Sky Astrophotographer",
                "title_ar": "مصوّر الفلك والفضاء العميق",
                "tip_en": "Bring intervalometers, sturdy carbon-fiber tripods, and dew heaters for late-night desert condensation.",
                "tip_ar": "احرص على إحضار حامل ثلاثي عالي الثبات وسخانات عدسات لمقاومة ندى الصحراء في الساعات المتأخرة."
            },
            PersonaType.FAMILY: {
                "title_en": "Family Stargazing & Desert Glamping",
                "title_ar": "تخييم وسياحة فلكية عائلية",
                "tip_en": "Choose camps with certified guides who provide laser-guided constellation tours and kid-friendly telescope views of Saturn's rings.",
                "tip_ar": "اختر مخيماً معتمداً يوفر مرشداً فلكياً وجولات بالليزر ورصداً ممتعاً للأطفال لرؤية حلقات زحل وتضاريس القمر."
            },
            PersonaType.DEEP_SKY: {
                "title_en": "Scientific & Deep-Sky Observer",
                "title_ar": "راصد فلكي وباحث الأجرام البعيدة",
                "tip_en": "Take advantage of Nafud's Bortle 1 SQM 21.95+ darkness to hunt faint Messier and NGC objects invisible elsewhere.",
                "tip_ar": "استفد من سماء النفود المصنفة بورتل 1 (SQM 21.95+) لرصد أجرام مسييه وسدم NGC الخافتة التي يستحيل رصدها في أي مكان آخر."
            },
            PersonaType.ROMANTIC: {
                "title_en": "Luxury Stargazing & Starlit Retreat",
                "title_ar": "ملاذ فلكي فاخر وتأمل النجوم",
                "tip_en": "Geodesic domes with transparent ceilings allow you to watch shooting stars and the Milky Way arch from the comfort of your bed.",
                "tip_ar": "توفر القباب الجيوديسية ذات الأسقف الشفافة فرصة تأمل الشهب وقوس درب التبانة في أجواء دافئة ومترفة."
            },
            PersonaType.ADVENTURER: {
                "title_en": "Desert Explorer & Archaeo-Astronomer",
                "title_ar": "مستكشف الصحراء والتراث الفلكي القديم",
                "tip_en": "Combine night sky observation with ancient 10,000-year-old rock inscriptions depicting star orientations and ancient hunts.",
                "tip_ar": "اجمع بين رصد قبة السماء واستكشاف النقوش الصخرية التي تعود لـ 10,000 سنة وتوثق حركات النجوم والرحلات القديمة."
            }
        }

        active_meta = persona_meta.get(req.persona, persona_meta[PersonaType.ASTROPHOTOGRAPHER])

        for spot in spots:
            score = 70 # baseline score
            reasons_en = []
            reasons_ar = []

            # 1. Distance filter & penalty
            if req.max_travel_distance_km and spot.distance_from_hail_km > req.max_travel_distance_km:
                score -= 30
                reasons_en.append(f"Requires {spot.distance_from_hail_km}km travel from Hail.")
                reasons_ar.append(f"يتطلب مسافة قيادة {spot.distance_from_hail_km} كم من حائل.")
            else:
                score += 5
                reasons_en.append(f"Convenient distance: {spot.distance_from_hail_km} km from Hail.")
                reasons_ar.append(f"مسافة ملائمة: {spot.distance_from_hail_km} كم من حائل.")

            # 2. Accommodations / Camps preference
            if req.requires_accommodation:
                if spot.is_camp:
                    score += 20
                    reasons_en.append("Certified desert camp with lodging & amenities.")
                    reasons_ar.append("مخيم صحراوي معتمد مزود بمرافق وخدمات إقامة.")
                else:
                    score -= 25

            # 3. Telescope requirement
            if req.requires_telescope:
                if spot.has_telescopes:
                    score += 15
                    reasons_en.append("High-aperture telescopes available on site.")
                    reasons_ar.append("تلسكوبات عالية الدقة متاحة في الموقع.")
                else:
                    score -= 15

            # 4. Persona-specific logic
            if req.persona == PersonaType.ASTROPHOTOGRAPHER:
                if spot.bortle_class == 1:
                    score += 25
                    reasons_en.append("Bortle 1 extreme darkness - Maximum contrast for Milky Way photography.")
                    reasons_ar.append("بورتل 1 (ظلام فلكي تام) - تباين فائق لتصوير سدم ومجرة درب التبانة.")
                elif spot.bortle_class == 2:
                    score += 15
                    reasons_en.append("Bortle 2 dark sky - Exceptional signal-to-noise ratio for cameras.")
                    reasons_ar.append("بورتل 2 - نسبة إشارة إلى ضوضاء ممتازة لحساسات الكاميرا.")

                if "dunes" in spot.id or "sanctuary" in spot.id:
                    score += 10
                    reasons_en.append("Iconic Al-Nafud dune foregrounds for dynamic compositions.")
                    reasons_ar.append("تكوينات كثبان النفود الحمراء الساحرة لمقدمة الصورة.")

            elif req.persona == PersonaType.FAMILY:
                if spot.id in ["jubbah-ghadha-camp", "mashar-aja-park", "tuwarin-hatim-valley"]:
                    score += 25
                    reasons_en.append("Safe, easily accessible terrain with family facilities.")
                    reasons_ar.append("طريق سهل ومرافق مجهزة ومناسبة تماماً لجميع أفراد العائلة.")
                if spot.is_camp:
                    score += 15
                    reasons_en.append("Catering, hot drinks, and indoor shelter available.")
                    reasons_ar.append("ضيافة ووجبات ومشروبات ساخنة وخيام استراحة مريحة.")

            elif req.persona == PersonaType.DEEP_SKY:
                if spot.bortle_class == 1:
                    score += 30
                    reasons_en.append("SQM > 21.90: Maximum visible magnitude of deep-sky objects.")
                    reasons_ar.append("مقياس ظلام SQM يتجاوز 21.90: أعلى وضوح لأجرام الفضاء العميق.")
                if spot.elevation_m >= 850:
                    score += 10
                    reasons_en.append(f"High altitude ({spot.elevation_m}m) minimizes atmospheric turbulence.")
                    reasons_ar.append(f"ارتفاع عالٍ ({spot.elevation_m} م) يقلل الاضطراب الجوي.")

            elif req.persona == PersonaType.ROMANTIC:
                if spot.id == "al-rassifa-ksrnr-domes":
                    score += 35
                    reasons_en.append("Luxury panoramic glass domes with celestial bedroom views.")
                    reasons_ar.append("قباب زجاجية بانورامية فاخرة لإطلالة على السماء من غرفة النوم.")
                elif spot.id == "baqaa-lake-oasis":
                    score += 20
                    reasons_en.append("Serene water reflections of stars and tranquil desert setting.")
                    reasons_ar.append("انعكاسات ساحرة للنجوم على صفحة الماء وأجواء صحراوية هادئة.")

            elif req.persona == PersonaType.ADVENTURER:
                if "4x4" in spot.access_difficulty:
                    score += 25
                    reasons_en.append("Thrilling 4x4 desert navigation deep into untouched dunes.")
                    reasons_ar.append("مغامرة قيادة دفع رباعي مشوقة في أعماق الكثبان البكر.")
                if spot.id in ["shuwaymis-unesco-reserve", "jubbah-umm-sinman-unesco"]:
                    score += 20
                    reasons_en.append("Proximity to UNESCO world heritage archaeo-astronomy sites.")
                    reasons_ar.append("موقع ملاصق لمواقع التراث العالمي لليونسكو والنقوش التاريخية.")

            # Normalization
            final_suitability = max(20, min(99, score))

            # Forecast calculation for predicted SCI
            forecasts = StargazingEngine.generate_7day_forecast(spot.bortle_class, spot.elevation_m)
            best_forecast_day = max(forecasts, key=lambda d: d.sci_score)

            scored_items.append(RecommendedSpotItem(
                spot=spot,
                suitability_score=final_suitability,
                match_reasons_en=reasons_en,
                match_reasons_ar=reasons_ar,
                best_suggested_night_en=f"{best_forecast_day.day_name_en} ({best_forecast_day.date})",
                best_suggested_night_ar=f"{best_forecast_day.day_name_ar} ({best_forecast_day.date})",
                predicted_sci=best_forecast_day.sci_score
            ))

        # Sort descending by suitability score
        scored_items.sort(key=lambda x: x.suitability_score, reverse=True)

        return RecommendationResponse(
            persona=req.persona.value,
            persona_title_en=active_meta["title_en"],
            persona_title_ar=active_meta["title_ar"],
            recommendations=scored_items,
            astronomy_tip_en=active_meta["tip_en"],
            astronomy_tip_ar=active_meta["tip_ar"]
        )
