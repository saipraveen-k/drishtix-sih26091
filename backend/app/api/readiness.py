from fastapi import APIRouter
from backend.app.schemas.schemas import ReadinessCalculateRequest, ReadinessScoreResponse
from backend.app.schemes.matcher import calculate_readiness_score

router = APIRouter(prefix="/readiness", tags=["Finance & Document Readiness"])

@router.post("/calculate", response_model=ReadinessScoreResponse)
def calculate_readiness(req: ReadinessCalculateRequest):
    business_dummy = {"id": req.business_id, "required_skills": ["food processing", "agriculture"], "investment_min": 120000}
    res = calculate_readiness_score(req.profile.model_dump(), business_dummy, req.provided_documents)
    
    return ReadinessScoreResponse(
        overall_readiness_score=res["overall_readiness_score"],
        profile_readiness=res["profile_readiness"],
        business_readiness=res["business_readiness"],
        financial_readiness=res["financial_readiness"],
        document_readiness=res["document_readiness"],
        eligibility_readiness=res["eligibility_readiness"],
        missing_requirements=res["missing_requirements"],
        document_checklist=res["document_checklist"]
    )
