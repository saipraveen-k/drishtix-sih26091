from fastapi import APIRouter
from backend.app.schemas.schemas import BusinessPlanGenerateRequest, BusinessPlanResponse
from backend.app.business_plan.generator import generate_business_plan_document

router = APIRouter(prefix="/business-plan", tags=["Business Plan Generator"])

@router.post("/generate", response_model=BusinessPlanResponse)
def generate_business_plan(req: BusinessPlanGenerateRequest):
    profile_dict = req.profile.model_dump()
    business_dummy = {
        "id": req.opportunity_id,
        "name": "Millet Processing & Packaging",
        "category": "Food Processing",
        "description": "Primary processing and retail packaging of ragi, bajra, and jowar.",
        "investment_min": 120000,
        "working_capital": 35000,
        "infrastructure_requirements": ["Single-phase power", "Dry shed"],
        "resource_requirements": ["Millet crops", "Water supply"]
    }
    market_dummy = {"demand_index": 85, "population": 14500, "nearest_market_km": 4.5, "road_connectivity": "Good", "competition_density": 38}

    res = generate_business_plan_document(profile_dict, business_dummy, market_dummy)
    return BusinessPlanResponse(**res)
