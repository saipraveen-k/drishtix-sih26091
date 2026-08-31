"""
DrishtiX Business Interest Normalization Module
Maps free-text entrepreneur business interest strings into canonical business objects
while strictly preserving the user's original raw entered string.
"""

from typing import Dict, Any, List, Optional
import re

ALIAS_MAPPING = {
    "millet": "biz_millet_01",
    "ragi": "biz_millet_01",
    "bajra": "biz_millet_01",
    "jowar": "biz_millet_01",
    "millet processing": "biz_millet_01",
    "millet food": "biz_millet_01",
    
    "restaurant": "biz_restaurant_10",
    "hotel": "biz_restaurant_10",
    "dhaba": "biz_restaurant_10",
    "tiffin": "biz_restaurant_10",
    "food stall": "biz_restaurant_10",
    "canteen": "biz_restaurant_10",
    "eating joint": "biz_restaurant_10",

    "food dehydration": "biz_food_dehydration_11",
    "solar drying": "biz_food_dehydration_11",
    "dehydration": "biz_food_dehydration_11",
    "fruit drying": "biz_food_dehydration_11",

    "dairy": "biz_dairy_03",
    "milk": "biz_dairy_03",
    "paneer": "biz_dairy_03",
    "ghee": "biz_dairy_03",
    "curd": "biz_dairy_03",
    "dairy farming": "biz_dairy_03",

    "tailoring": "biz_tailoring_12",
    "garment": "biz_tailoring_12",
    "stitching": "biz_tailoring_12",
    "boutique": "biz_tailoring_12",
    "uniform": "biz_tailoring_12",

    "mobile": "biz_mobile_repair_13",
    "mobile repair": "biz_mobile_repair_13",
    "cell phone": "biz_mobile_repair_13",
    "smartphone": "biz_mobile_repair_13",

    "retail": "biz_retail_14",
    "kirana": "biz_retail_14",
    "grocery": "biz_retail_14",
    "general store": "biz_retail_14",

    "custom hiring": "biz_customhiring_09",
    "agri equipment rental": "biz_customhiring_09",
    "tiller rental": "biz_customhiring_09",
    "farm machinery": "biz_customhiring_09",

    "spice": "biz_spice_02",
    "turmeric": "biz_spice_02",
    "chilli": "biz_spice_02",
    "masala": "biz_spice_02",

    "vermicompost": "biz_biofert_05",
    "bio fertilizer": "biz_biofert_05",
    "compost": "biz_biofert_05",
    "organic manure": "biz_biofert_05",

    "poultry": "biz_poultry_06",
    "egg": "biz_poultry_06",
    "chicken": "biz_poultry_06",

    "handicraft": "biz_craft_07",
    "jute": "biz_craft_07",
    "bags": "biz_craft_07",

    "digital": "biz_digital_08",
    "csc": "biz_digital_08",
    "e-governance": "biz_digital_08",
    "online services": "biz_digital_08",

    "solar pump": "biz_solar_04",
    "solar repair": "biz_solar_04"
}

def normalize_business_interest(user_input: str, catalog: List[Dict[str, Any]]) -> Dict[str, Any]:
    raw_input = user_input.strip() if user_input else "General Micro-Enterprise"
    lower_input = raw_input.lower()

    # 1. Exact or partial alias match
    matched_biz_id = None
    for term, biz_id in ALIAS_MAPPING.items():
        if term in lower_input or lower_input in term:
            matched_biz_id = biz_id
            break

    catalog_dict = {b["id"]: b for b in catalog}

    if matched_biz_id and matched_biz_id in catalog_dict:
        canonical = catalog_dict[matched_biz_id].copy()
        return {
            "user_entered_business": raw_input,
            "canonical_business_id": canonical["id"],
            "canonical_business_name": canonical["name"],
            "category": canonical["category"],
            "business_object": canonical,
            "is_custom": False
        }

    # 2. Match directly against catalog names or descriptions
    for biz in catalog:
        b_name = biz["name"].lower()
        b_cat = biz["category"].lower()
        b_desc = biz["description"].lower()
        if lower_input in b_name or b_name in lower_input or lower_input in b_cat or lower_input in b_desc:
            return {
                "user_entered_business": raw_input,
                "canonical_business_id": biz["id"],
                "canonical_business_name": biz["name"],
                "category": biz["category"],
                "business_object": biz,
                "is_custom": False
            }

    # 3. Fallback: Create synthetic canonical representation for unlisted business
    synthetic_id = f"biz_custom_{re.sub(r'[^a-zA-Z0-9]', '_', lower_input)[:20]}"
    synthetic_name = raw_input.title()
    synthetic_biz = {
        "id": synthetic_id,
        "name": synthetic_name,
        "category": "Services & Enterprise",
        "description": f"Custom micro-enterprise unit focusing on {raw_input}.",
        "required_skills": ["services", "retail"],
        "investment_min": 100000.0,
        "investment_max": 250000.0,
        "working_capital": 30000.0,
        "resource_requirements": ["commercial space", "operating tools"],
        "infrastructure_requirements": ["electricity", "road access"],
        "risk_level": "MEDIUM",
        "seasonality": "Year-Round",
        "growth_potential": "MEDIUM",
        "typical_cost_structure": {
          "raw_material_pct": 45,
          "labor_pct": 20,
          "electricity_and_rent_pct": 12,
          "packaging_and_transport_pct": 8,
          "net_margin_pct": 15,
          "typical_monthly_revenue": 70000.0
        }
    }

    return {
        "user_entered_business": raw_input,
        "canonical_business_id": synthetic_id,
        "canonical_business_name": synthetic_name,
        "category": synthetic_biz["category"],
        "business_object": synthetic_biz,
        "is_custom": True
    }
