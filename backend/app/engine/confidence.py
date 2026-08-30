"""
DrishtiX Confidence Score Calculator
Determines recommendation confidence based on data completeness, freshness, source quality, and consistency.
"""

from typing import Dict, Any

def calculate_confidence_score(market_data: Dict[str, Any], profile: Dict[str, Any]) -> Dict[str, Any]:
    score = 100.0
    deductions = []

    # Data Quality Check
    quality = market_data.get("data_quality", "HIGH")
    if quality == "MEDIUM":
        score -= 15.0
        deductions.append("Local market indicators are proxy estimates.")
    elif quality == "LOW":
        score -= 30.0
        deductions.append("Limited direct local census data; relying on district averages.")

    # Profile Completeness Check
    if not profile.get("skills"):
        score -= 10.0
        deductions.append("Skill details incomplete.")

    if not profile.get("available_capital") or profile.get("available_capital") == 0:
        score -= 10.0
        deductions.append("Capital details unspecified.")

    if not profile.get("village") or profile.get("village") == "Unknown":
        score -= 10.0
        deductions.append("Exact village location pending validation.")

    final_confidence = round(max(30.0, score), 1)

    if final_confidence >= 80.0:
        level = "HIGH"
    elif final_confidence >= 60.0:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {
        "confidence_score": final_confidence,
        "confidence_level": level,
        "deductions": deductions
    }
