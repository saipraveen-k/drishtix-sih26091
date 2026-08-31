"""
DrishtiX Interest Evaluation Engine
Provides deterministic evaluation of user-specified business interest,
ranks better-suited alternative businesses, and generates explainability & comparison matrices.
"""

from typing import Dict, Any, List
from backend.app.engine.scoring import compute_opportunity_score
from backend.app.engine.confidence import calculate_confidence_score
from backend.app.engine.normalization import normalize_business_interest

def evaluate_fit_level(score: float) -> str:
    if score >= 85.0:
        return "Excellent Match"
    elif score >= 75.0:
        return "Strong Match"
    elif score >= 60.0:
        return "Promising Fit"
    else:
        return "Requires Consideration"

def generate_why_this_score(scoring_res: Dict[str, Any], market_data: Dict[str, Any], business: Dict[str, Any]) -> List[Dict[str, str]]:
    """
    Generates empirical, evidence-backed positive & warning bullets strictly mapped to factor scores.
    """
    factors = scoring_res
    reasons = []

    # Demand
    demand = factors.get("demand_score", 75.0)
    if demand >= 80:
        reasons.append({"type": "positive", "text": f"Strong local market demand index ({demand:.1f}/100) in target block"})
    else:
        reasons.append({"type": "warning", "text": f"Moderate local demand index ({demand:.1f}/100); requires active customer outreach"})

    # Skill Fit
    skill_fit = factors.get("skill_fit_score", 70.0)
    if skill_fit >= 75:
        reasons.append({"type": "positive", "text": "Your declared skills directly match core operational requirements"})
    else:
        reasons.append({"type": "warning", "text": "Skill gap detected; short vocational or technical training recommended"})

    # Capital Fit
    capital_fit = factors.get("capital_fit_score", 70.0)
    if capital_fit >= 80:
        reasons.append({"type": "positive", "text": "Fits your available equity capital with minimal borrowing requirement"})
    elif capital_fit >= 50:
        reasons.append({"type": "warning", "text": "Requires government scheme loan assistance (MUDRA/PMEGP) to bridge funding gap"})
    else:
        reasons.append({"type": "negative", "text": "Significant capital gap relative to setup costs; high initial debt load"})

    # Supply / Raw Material
    breakdown_map = {item["factor_name"]: item["score"] for item in scoring_res.get("score_breakdown", [])}
    supply = breakdown_map.get("Supply Availability", 70.0)
    if supply >= 75:
        reasons.append({"type": "positive", "text": "Key raw materials & resources are accessible within local cluster"})
    else:
        reasons.append({"type": "warning", "text": "Supply chain relies on external transport from district market"})

    # Infrastructure
    infra = breakdown_map.get("Infrastructure Readiness", 70.0)
    if infra >= 75:
        reasons.append({"type": "positive", "text": "Road connectivity & electricity infrastructure are suitable"})

    # Growth & Risk
    risk = factors.get("risk_score", 65.0)
    if risk >= 75:
        reasons.append({"type": "positive", "text": "Low risk profile with predictable operational cash flows"})
    elif risk < 55:
        reasons.append({"type": "warning", "text": "Moderate to high operational risk; vulnerable to input price volatility"})

    return reasons

def evaluate_interested_business(
    profile: Dict[str, Any],
    user_entered_interest: str,
    catalog: List[Dict[str, Any]],
    market_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Main evaluation pipeline for the entrepreneur's declared business interest.
    """
    # 1. Normalize business interest
    norm_res = normalize_business_interest(user_entered_interest, catalog)
    biz = norm_res["business_object"]

    # 2. Calculate deterministic opportunity score
    scoring_res = compute_opportunity_score(profile, biz, market_data)
    confidence_res = calculate_confidence_score(market_data, profile)

    opp_score = scoring_res["final_score"]
    fit_lvl = evaluate_fit_level(opp_score)
    why_reasons = generate_why_this_score(scoring_res, market_data, biz)

    # 3. Factor dictionary mapping
    breakdown_dict = {item["factor_name"]: item["score"] for item in scoring_res["score_breakdown"]}
    factors = {
        "demand": round(breakdown_dict.get("Local Market Demand", scoring_res["demand_score"]), 1),
        "skill_fit": round(breakdown_dict.get("Skill & Profile Fit", scoring_res["skill_fit_score"]), 1),
        "capital_fit": round(breakdown_dict.get("Capital Compatibility", scoring_res["capital_fit_score"]), 1),
        "supply": round(breakdown_dict.get("Supply Availability", 70.0), 1),
        "infrastructure": round(breakdown_dict.get("Infrastructure Readiness", 65.0), 1),
        "growth": round(breakdown_dict.get("Growth Potential", 75.0), 1),
        "risk": round(breakdown_dict.get("Risk Mitigation", scoring_res["risk_score"]), 1)
    }

    # 4. Interest vs Suitability radar composite
    personal_fit = round((factors["skill_fit"] * 0.6) + (factors["capital_fit"] * 0.4), 1)
    market_fit = round((factors["demand"] * 0.5) + (factors["supply"] * 0.25) + (factors["infrastructure"] * 0.25), 1)
    financial_fit = round((factors["capital_fit"] * 0.7) + (factors["risk"] * 0.3), 1)

    # 5. Evaluate candidate businesses in catalog for top better-suited alternatives
    alternatives = []
    for cand in catalog:
        # Exclude exact canonical match
        if cand["id"] == norm_res["canonical_business_id"]:
            continue

        cand_scoring = compute_opportunity_score(profile, cand, market_data)
        cand_conf = calculate_confidence_score(market_data, profile)
        cand_score = cand_scoring["final_score"]

        cand_breakdown = {item["factor_name"]: item["score"] for item in cand_scoring["score_breakdown"]}
        cand_factors = {
            "demand": round(cand_breakdown.get("Local Market Demand", cand_scoring["demand_score"]), 1),
            "skill_fit": round(cand_breakdown.get("Skill & Profile Fit", cand_scoring["skill_fit_score"]), 1),
            "capital_fit": round(cand_breakdown.get("Capital Compatibility", cand_scoring["capital_fit_score"]), 1),
            "supply": round(cand_breakdown.get("Supply Availability", 70.0), 1),
            "infrastructure": round(cand_breakdown.get("Infrastructure Readiness", 65.0), 1),
            "growth": round(cand_breakdown.get("Growth Potential", 75.0), 1),
            "risk": round(cand_breakdown.get("Risk Mitigation", cand_scoring["risk_score"]), 1)
        }

        # Key reasons why alternative is strong
        cand_reasons = []
        if cand_factors["demand"] >= 85:
            cand_reasons.append("High local market demand")
        if cand_factors["capital_fit"] >= 85:
            cand_reasons.append("Optimal capital compatibility")
        if cand_factors["skill_fit"] >= 80:
            cand_reasons.append("Strong profile & skill alignment")
        if cand_factors["risk"] >= 80:
            cand_reasons.append("Lower operational risk profile")
        if not cand_reasons:
            cand_reasons.append("Favorable local market parameters")

        alternatives.append({
            "business_id": cand["id"],
            "business_name": cand["name"],
            "category": cand["category"],
            "description": cand["description"],
            "opportunity_score": cand_score,
            "confidence_score": cand_conf["confidence_score"],
            "fit_level": evaluate_fit_level(cand_score),
            "investment_min": cand["investment_min"],
            "investment_max": cand["investment_max"],
            "working_capital": cand["working_capital"],
            "factors": cand_factors,
            "why_better": cand_reasons[:3],
            "score_breakdown": cand_scoring["score_breakdown"]
        })

    # Sort alternatives descending by score
    alternatives.sort(key=lambda x: x["opportunity_score"], reverse=True)
    top_alternatives = alternatives[:4]

    # 6. Generate comparison matrix between Interested Business & Best Alternative
    best_alt = top_alternatives[0] if top_alternatives else None

    comparison_factors = [
        {"factor_key": "demand", "label": "Local Demand", "user_choice_score": factors["demand"], "best_alt_score": best_alt["factors"]["demand"] if best_alt else factors["demand"]},
        {"factor_key": "skill_fit", "label": "Skill Fit", "user_choice_score": factors["skill_fit"], "best_alt_score": best_alt["factors"]["skill_fit"] if best_alt else factors["skill_fit"]},
        {"factor_key": "capital_fit", "label": "Capital Fit", "user_choice_score": factors["capital_fit"], "best_alt_score": best_alt["factors"]["capital_fit"] if best_alt else factors["capital_fit"]},
        {"factor_key": "supply", "label": "Supply Availability", "user_choice_score": factors["supply"], "best_alt_score": best_alt["factors"]["supply"] if best_alt else factors["supply"]},
        {"factor_key": "infrastructure", "label": "Infrastructure", "user_choice_score": factors["infrastructure"], "best_alt_score": best_alt["factors"]["infrastructure"] if best_alt else factors["infrastructure"]},
        {"factor_key": "growth", "label": "Growth Potential", "user_choice_score": factors["growth"], "best_alt_score": best_alt["factors"]["growth"] if best_alt else factors["growth"]},
        {"factor_key": "risk", "label": "Risk Safety", "user_choice_score": factors["risk"], "best_alt_score": best_alt["factors"]["risk"] if best_alt else factors["risk"]},
        {"factor_key": "overall", "label": "Overall Score", "user_choice_score": opp_score, "best_alt_score": best_alt["opportunity_score"] if best_alt else opp_score}
    ]

    return {
        "interested_business": {
            "user_entered_business": norm_res["user_entered_business"],
            "canonical_business_id": norm_res["canonical_business_id"],
            "canonical_business_name": norm_res["canonical_business_name"],
            "category": norm_res["category"],
            "description": biz["description"],
            "opportunity_score": opp_score,
            "confidence_score": confidence_res["confidence_score"],
            "confidence_level": confidence_res["confidence_level"],
            "fit_level": fit_lvl,
            "investment_min": biz["investment_min"],
            "investment_max": biz["investment_max"],
            "working_capital": biz["working_capital"],
            "factors": factors,
            "score_breakdown": scoring_res["score_breakdown"],
            "why_reasons": why_reasons,
            "suitability_metrics": {
                "interest_level": "High",
                "personal_fit": personal_fit,
                "market_fit": market_fit,
                "financial_fit": financial_fit,
                "overall_score": opp_score
            },
            "data_transparency": {
                "data_source": market_data.get("data_source", "DrishtiX Verified Rural Repository"),
                "source_year": "2026",
                "geographic_coverage": "District / Block Level",
                "freshness": "Updated Q1 2026",
                "confidence": confidence_res["confidence_level"],
                "proxy_status": "Verified District Proxy"
            }
        },
        "alternatives": top_alternatives,
        "comparison": {
            "best_alternative": {
                "business_id": best_alt["business_id"] if best_alt else "",
                "business_name": best_alt["business_name"] if best_alt else "",
                "opportunity_score": best_alt["opportunity_score"] if best_alt else 0.0
            },
            "factor_matrix": comparison_factors
        }
    }
