"""
DrishtiX Explainable Opportunity Scoring Engine
Calculates defensible 7-factor composite scores (0-100) for rural business recommendations.
"""

from typing import Dict, Any, List

DEFAULT_WEIGHTS = {
    "demand": 0.25,
    "skill_fit": 0.20,
    "capital_fit": 0.15,
    "supply_availability": 0.10,
    "infrastructure": 0.10,
    "growth_potential": 0.10,
    "risk": 0.10
}

def calculate_skill_fit_score(user_skills: List[str], required_skills: List[str]) -> float:
    if not required_skills:
        return 80.0
    if not user_skills:
        return 40.0
    user_skills_lower = [s.lower() for s in user_skills]
    matched = 0
    for req in required_skills:
        req_lower = req.lower()
        if any(req_lower in s or s in req_lower for s in user_skills_lower):
            matched += 1
    match_ratio = matched / len(required_skills)
    return round(40.0 + (match_ratio * 60.0), 1)

def calculate_capital_fit_score(available_capital: float, min_inv: float, max_inv: float) -> float:
    if available_capital <= 0:
        return 30.0
    if min_inv <= available_capital <= max_inv:
        return 95.0
    elif available_capital > max_inv:
        return 90.0 # Highly compatible, has surplus
    else: # available_capital < min_inv
        deficit_ratio = available_capital / min_inv
        if deficit_ratio >= 0.7:
            return 75.0 # Feasible with small MUDRA/PMEGP loan
        elif deficit_ratio >= 0.4:
            return 50.0 # Needs major loan backing
        else:
            return 25.0 # Insufficient capital fit

def calculate_risk_score(risk_level: str, experience_level: str) -> float:
    # Converts risk level & experience into a 0-100 safety score (higher is safer/better)
    base_scores = {"LOW": 90.0, "MEDIUM": 70.0, "HIGH": 45.0}
    score = base_scores.get(risk_level.upper(), 65.0)
    if experience_level == "experienced":
        score = min(100.0, score + 10.0)
    elif experience_level == "beginner" and risk_level.upper() == "HIGH":
        score = max(20.0, score - 15.0)
    return score

def compute_opportunity_score(
    profile: Dict[str, Any],
    business: Dict[str, Any],
    market_data: Dict[str, Any],
    weights: Dict[str, float] = None
) -> Dict[str, Any]:

    w = weights if weights else DEFAULT_WEIGHTS

    # 1. Demand Score (0-100)
    demand_val = float(market_data.get("demand_index", 75.0))

    # 2. Skill Fit Score (0-100)
    user_skills = profile.get("skills", [])
    required_skills = business.get("required_skills", [])
    skill_fit_val = calculate_skill_fit_score(user_skills, required_skills)

    # 3. Capital Fit Score (0-100)
    cap = float(profile.get("available_capital", 0.0))
    min_inv = float(business.get("investment_min", 100000.0))
    max_inv = float(business.get("investment_max", 250000.0))
    capital_fit_val = calculate_capital_fit_score(cap, min_inv, max_inv)

    # 4. Supply Availability Score (0-100)
    supply_val = float(market_data.get("resource_score", 70.0))

    # 5. Infrastructure Score (0-100)
    infra_val = float(market_data.get("infra_score", 65.0))

    # 6. Growth Potential Score (0-100)
    growth_str = business.get("growth_potential", "HIGH").upper()
    growth_map = {"HIGH": 90.0, "MEDIUM": 70.0, "LOW": 50.0}
    growth_val = growth_map.get(growth_str, 75.0)

    # 7. Risk Score (0-100)
    risk_str = business.get("risk_level", "MEDIUM")
    exp_lvl = profile.get("experience_level", "beginner")
    risk_val = calculate_risk_score(risk_str, exp_lvl)

    # Calculate Weighted Composite Score
    total_score = (
        w["demand"] * demand_val +
        w["skill_fit"] * skill_fit_val +
        w["capital_fit"] * capital_fit_val +
        w["supply_availability"] * supply_val +
        w["infrastructure"] * infra_val +
        w["growth_potential"] * growth_val +
        w["risk"] * risk_val
    )
    final_score = round(total_score, 1)

    breakdown = [
        {"factor_name": "Local Market Demand", "weight_pct": 25, "score": round(demand_val, 1), "description": "Local consumer & market purchasing power"},
        {"factor_name": "Skill & Profile Fit", "weight_pct": 20, "score": round(skill_fit_val, 1), "description": "Compatibility with entrepreneur experience & skills"},
        {"factor_name": "Capital Compatibility", "weight_pct": 15, "score": round(capital_fit_val, 1), "description": "Equity capital vs initial setup requirements"},
        {"factor_name": "Supply Availability", "weight_pct": 10, "score": round(supply_val, 1), "description": "Raw material & resource access in village/block"},
        {"factor_name": "Infrastructure Readiness", "weight_pct": 10, "score": round(infra_val, 1), "description": "Road, power, and market connectivity"},
        {"factor_name": "Growth Potential", "weight_pct": 10, "score": round(growth_val, 1), "description": "Scalability and market expansion trend"},
        {"factor_name": "Risk Mitigation", "weight_pct": 10, "score": round(risk_val, 1), "description": "Operational risk level & downside safety"}
    ]

    return {
        "final_score": final_score,
        "score_breakdown": breakdown,
        "demand_score": demand_val,
        "skill_fit_score": skill_fit_val,
        "capital_fit_score": capital_fit_val,
        "risk_score": risk_val
    }
