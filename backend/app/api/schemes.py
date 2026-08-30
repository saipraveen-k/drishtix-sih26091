from fastapi import APIRouter
from backend.app.schemas.schemas import SchemeMatchRequest, SchemeMatchResponse
from backend.app.schemes.matcher import match_schemes_for_opportunity

router = APIRouter(prefix="/schemes", tags=["Scheme & Finance Readiness"])

@router.post("/match", response_model=SchemeMatchResponse)
def match_schemes(req: SchemeMatchRequest):
    res = match_schemes_for_opportunity(
        profile=req.profile.model_dump(),
        business_id=req.business_id,
        category=req.category,
        investment_required=req.investment_required
    )
    return SchemeMatchResponse(
        business_id=req.business_id,
        total_matched=res["total_matched"],
        schemes=res["schemes"]
    )
