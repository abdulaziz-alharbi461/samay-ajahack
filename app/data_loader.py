import json
import os
from typing import List, Optional
from app.models import Spot, SpotType, PlatformStats

DATA_FILE_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "spots.json")

class DataLoader:
    _cached_spots: Optional[List[Spot]] = None
    _cached_mtime: float = 0.0

    @classmethod
    def get_all_spots(cls) -> List[Spot]:
        if not os.path.exists(DATA_FILE_PATH):
            raise FileNotFoundError(f"Spots data file not found at {DATA_FILE_PATH}")
        mtime = os.path.getmtime(DATA_FILE_PATH)
        if cls._cached_spots is None or mtime > cls._cached_mtime:
            with open(DATA_FILE_PATH, "r", encoding="utf-8") as f:
                raw_data = json.load(f)
                cls._cached_spots = [Spot(**item) for item in raw_data]
            cls._cached_mtime = mtime
        return cls._cached_spots

    @classmethod
    def get_spot_by_id(cls, spot_id: str) -> Optional[Spot]:
        spots = cls.get_all_spots()
        for spot in spots:
            if spot.id == spot_id:
                return spot
        return None

    @classmethod
    def filter_spots(
        cls,
        spot_type: Optional[str] = None,
        max_bortle: Optional[int] = None,
        is_camp: Optional[bool] = None,
        has_telescopes: Optional[bool] = None,
        search_query: Optional[str] = None
    ) -> List[Spot]:
        spots = cls.get_all_spots()
        results = []
        for s in spots:
            if spot_type and s.type.value != spot_type:
                continue
            if max_bortle is not None and s.bortle_class > max_bortle:
                continue
            if is_camp is not None and s.is_camp != is_camp:
                continue
            if has_telescopes is not None and s.has_telescopes != has_telescopes:
                continue
            if search_query:
                q = search_query.lower().strip()
                match = (
                    q in s.name_en.lower() or
                    q in s.name_ar.lower() or
                    q in s.description_en.lower() or
                    q in s.description_ar.lower() or
                    q in s.category.lower()
                )
                if not match:
                    continue
            results.append(s)
        return results

    @classmethod
    def get_platform_stats(cls) -> PlatformStats:
        spots = cls.get_all_spots()
        total_spots = len(spots)
        certified_camps = sum(1 for s in spots if s.is_camp)
        bortle_1_count = sum(1 for s in spots if s.bortle_class == 1)
        max_sqm = max(s.sqm_value for s in spots) if spots else 21.95

        return PlatformStats(
            total_spots=total_spots,
            certified_camps=certified_camps,
            dark_sky_sqm_max=max_sqm,
            bortle_1_sites_count=bortle_1_count,
            park_area_sqkm=45200, # Al-Nafud Dark Sky Reserve approximate conservation area
            active_meteor_shower="Perseids & Autumn Aurigids",
            active_meteor_shower_ar="البرشاويات والعوّاء الخريفية",
            lunar_cycle_stage_en="Waxing Crescent (Optimal Stargazing Window)",
            lunar_cycle_stage_ar="هلال متزايد (نافذة رصد مثالية مبكرة)"
        )
