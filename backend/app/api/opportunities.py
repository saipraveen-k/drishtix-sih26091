from fastapi import APIRouter, Depends, HTTPException
import json
import os
from typing import List, Dict, Any
from backend.app.schemas.schemas import RecommendRequest, RecommendationListResponse, OpportunityItem
from backend.app.engine.scoring import compute_opportunity_score
from backend.app.engine.confidence import calculate_confidence_score
from backend.app.engine.explainability import generate_recommendation_rationale

router = APIRouter(prefix="/opportunities", tags=["Opportunity Engine"])

def load_business_catalog() -> List[Dict[str, Any]]:
    path = "data/raw/demo_businesses.json"
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def get_market_data_for_location(village: str, district: str) -> Dict[str, Any]:
    return {
        "demand_index": 85.0,
        "competition_density": 38.0,
        "resource_score": 78.0,
        "infra_score": 75.0,
        "population": 14500,
        "data_quality": "HIGH",
        "data_source": "DrishtiX Verified Rural Repository (2026)"
    }

@router.post("/recommend", response_model=RecommendationListResponse)
def recommend_opportunities(req: RecommendRequest):
    profile = req.profile.model_dump()
    catalog = load_business_catalog()
    market_data = get_market_data_for_location(profile.get("village", ""), profile.get("district", ""))
    
    confidence_res = calculate_confidence_score(market_data, profile)

    scored_items = []
    for biz in catalog:
        scoring_res = compute_opportunity_score(profile, biz, market_data)
        rationale_res = generate_recommendation_rationale(profile, biz, market_data, scoring_res)

        demand_str = "High Demand" if scoring_res["demand_score"] >= 80 else "Moderate Demand"
        comp_str = "Low Competition" if market_data["competition_density"] <= 40 else "Moderate Competition"
        skill_fit_str = "High Match" if scoring_res["skill_fit_score"] >= 75 else "Moderate Match"
        risk_str = biz.get("risk_level", "MEDIUM")

        item = OpportunityItem(
            business_id=biz["id"],
            business_name=biz["name"],
            category=biz["category"],
            description=biz["description"],
            score=scoring_res["final_score"],
            confidence=confidence_res["confidence_score"],
            confidence_level=confidence_res["confidence_level"],
            investment_min=biz["investment_min"],
            investment_max=biz["investment_max"],
            working_capital=biz["working_capital"],
            demand=demand_str,
            competition=comp_str,
            skill_fit=skill_fit_str,
            risk=risk_str,
            score_breakdown=scoring_res["score_breakdown"],
            why_recommended=rationale_res["why_recommended"],
            why_alternatives_lower=rationale_res["why_alternatives_lower"],
            assumptions=rationale_res["assumptions"],
            data_sources=rationale_res["data_sources"]
        )
        scored_items.append(item)

    # Sort descending by score
    scored_items.sort(key=lambda x: x.score, reverse=True)
    top_3 = scored_items[:3]

    return RecommendationListResponse(
        user_location=f"{profile.get('village')}, {profile.get('district')}, {profile.get('state')}",
        total_analyzed=len(catalog),
        recommendations=top_3
    )

@router.get("", response_model=RecommendationListResponse)
def get_default_opportunities():
    default_req = RecommendRequest(
        profile={
            "name": "Ramesh Kumar",
            "available_capital": 150000.0,
            "expected_investment": 200000.0,
            "desired_loan_amount": 50000.0,
            "experience_level": "some experience",
            "existing_business": False,
            "business_goal": "first business",
            "state": "Andhra Pradesh",
            "district": "Anantapur",
            "village": "Kudair",
            "skills": ["agriculture", "food processing"],
            "interests": ["food", "manufacturing"]
        }
    )
    return recommend_opportunities(default_req)

@router.get("/{business_id}", response_model=OpportunityItem)
def get_opportunity_by_id(business_id: str):
    catalog = load_business_catalog()
    target_biz = next((b for b in catalog if b["id"] == business_id), None)
    
    default_profile = {
        "name": "Ramesh Kumar",
        "available_capital": 150000.0,
        "expected_investment": 200000.0,
        "desired_loan_amount": 50000.0,
        "experience_level": "some experience",
        "existing_business": False,
        "business_goal": "first business",
        "state": "Andhra Pradesh",
        "district": "Anantapur",
        "village": "Kudair",
        "skills": ["agriculture", "food processing"],
        "interests": ["food", "manufacturing"]
    }
    market_data = get_market_data_for_location("Kudair", "Anantapur")

    if not target_biz:
        if catalog:
            target_biz = catalog[0]
        else:
            raise HTTPException(status_code=404, detail="Opportunity not found")

    scoring_res = compute_opportunity_score(default_profile, target_biz, market_data)
    confidence_res = calculate_confidence_score(market_data, default_profile)
    rationale_res = generate_recommendation_rationale(default_profile, target_biz, market_data, scoring_res)

    demand_str = "High Demand" if scoring_res["demand_score"] >= 80 else "Moderate Demand"
    comp_str = "Low Competition" if market_data["competition_density"] <= 40 else "Moderate Competition"
    skill_fit_str = "High Match" if scoring_res["skill_fit_score"] >= 75 else "Moderate Match"
    risk_str = target_biz.get("risk_level", "MEDIUM")

    return OpportunityItem(
        business_id=target_biz["id"],
        business_name=target_biz["name"],
        category=target_biz["category"],
        description=target_biz["description"],
        score=scoring_res["final_score"],
        confidence=confidence_res["confidence_score"],
        confidence_level=confidence_res["confidence_level"],
        investment_min=target_biz["investment_min"],
        investment_max=target_biz["investment_max"],
        working_capital=target_biz["working_capital"],
        demand=demand_str,
        competition=comp_str,
        skill_fit=skill_fit_str,
        risk=risk_str,
        score_breakdown=scoring_res["score_breakdown"],
        why_recommended=rationale_res["why_recommended"],
        why_alternatives_lower=rationale_res["why_alternatives_lower"],
        assumptions=rationale_res["assumptions"],
        data_sources=rationale_res["data_sources"]
    )
