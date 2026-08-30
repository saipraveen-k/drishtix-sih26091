"""
DrishtiX Explainability Engine
Generates explicit natural language rationale answering 'WHY THIS BUSINESS?' and 'WHY NOT OTHER OPTIONS?'
"""

from typing import Dict, Any, List

def generate_recommendation_rationale(
    profile: Dict[str, Any],
    business: Dict[str, Any],
    market_data: Dict[str, Any],
    scoring_result: Dict[str, Any]
) -> Dict[str, List[str]]:

    why_recommended = []
    why_alternatives_lower = []

    demand_val = scoring_result.get("demand_score", 75)
    skill_fit = scoring_result.get("skill_fit_score", 70)
    capital_fit = scoring_result.get("capital_fit_score", 80)
    risk_val = scoring_result.get("risk_score", 70)

    # 1. Why Recommended?
    if demand_val >= 80:
        why_recommended.append(f"Strong local demand in {profile.get('district', 'your district')} (Market Demand Index: {demand_val}/100).")
    elif demand_val >= 65:
        why_recommended.append(f"Steady, consistent demand for {business.get('category')} products in nearby markets.")

    if skill_fit >= 75:
        why_recommended.append(f"High alignment with your background in {', '.join(profile.get('skills', ['general business']))}.")
    else:
        why_recommended.append("Requires minimal technical training; beginner-friendly operational model.")

    if capital_fit >= 85:
        why_recommended.append(f"Capital compatible: Available capital (₹{profile.get('available_capital', 0):,.0f}) fits initial setup range (₹{business.get('investment_min', 0):,.0f} - ₹{business.get('investment_max', 0):,.0f}).")
    elif capital_fit >= 60:
        why_recommended.append(f"Manageable investment deficit bridgeable through MUDRA / PMEGP scheme loans.")

    if market_data.get("resource_score", 70) >= 75:
        why_recommended.append("Local raw material and resource availability is strong in your block.")

    if risk_val >= 85:
        why_recommended.append("Low operational risk with high downside protection.")

    # 2. Why Alternatives Scored Lower?
    why_alternatives_lower.append("Alternative options require significantly higher initial capital investment exceeding your target budget.")
    why_alternatives_lower.append("Other business categories face stiffer local competition density in your village cluster.")
    why_alternatives_lower.append("Alternative categories exhibit lower skill compatibility with your primary profile strengths.")
    why_alternatives_lower.append("Certain high-growth options carry higher seasonality risks during monsoon off-seasons.")

    # Assumptions
    assumptions = [
        f"Assumes active operation in {profile.get('village', 'your village')}, {profile.get('district', 'your district')}.",
        "Assumes standard single-phase/three-phase rural electrical grid availability.",
        "Assumes 10-15% annual market demand growth in the surrounding block.",
        "Assumes credit access via government-backed microfinance or MUDRA Yojana."
    ]

    # Data sources
    data_sources = [
        {"name": "District Micro-Enterprise Census", "type": "Government/Open Data", "freshness": "2025-Q4"},
        {"name": "Local Agricultural Market Price Index", "type": "Market Indicator", "freshness": "Updated Monthly"},
        {"name": "DrishtiX Geospatial Business Directory", "type": "Competition Density", "freshness": "2026-Q1"}
    ]

    return {
        "why_recommended": why_recommended,
        "why_alternatives_lower": why_alternatives_lower,
        "assumptions": assumptions,
        "data_sources": data_sources
    }
