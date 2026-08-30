"""
DrishtiX Scheme Matching and Readiness Engine
Matches government schemes against entrepreneur profile, location, capital, and documents.
Calculates Document & Overall Readiness Scores (0-100%).
"""

import os
import json
from typing import Dict, Any, List

def load_scheme_catalog() -> List[Dict[str, Any]]:
    path = "data/raw/demo_schemes.json"
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []

def match_schemes_for_opportunity(
    profile: Dict[str, Any],
    business_id: str,
    category: str,
    investment_required: float
) -> Dict[str, Any]:

    all_schemes = load_scheme_catalog()
    matched = []

    for s in all_schemes:
        target_cats = [c.lower() for c in s.get("target_categories", [])]
        cat_lower = category.lower()

        # Check category relevance
        is_category_match = any(cat_lower in tc or tc in cat_lower for tc in target_cats) or "manufacturing" in target_cats or "services" in target_cats

        if is_category_match:
            relevance = f"Directly applicable for {category} enterprises under {s.get('nodal_agency', 'Govt Scheme')}."
            benefit = f"Financial subsidy: {s.get('subsidy_rate', 'Credit-linked subsidy')} | Max Loan/Cost: ₹{s.get('max_project_cost', s.get('max_loan', 1000000)):,.0f}"
            
            matched.append({
                "scheme_id": s.get("scheme_id"),
                "name": s.get("name"),
                "nodal_agency": s.get("nodal_agency"),
                "relevance_reason": relevance,
                "eligibility_status": "Potentially Relevant",
                "potential_benefit": benefit,
                "required_documents": s.get("required_documents", []),
                "description": s.get("description", "")
            })

    return {
        "business_id": business_id,
        "total_matched": len(matched),
        "schemes": matched
    }

def calculate_readiness_score(
    profile: Dict[str, Any],
    business: Dict[str, Any],
    provided_documents: List[str]
) -> Dict[str, Any]:

    # 1. Profile Readiness (0-100)
    profile_score = 100.0 if profile.get("name") and profile.get("district") and profile.get("village") else 70.0

    # 2. Business Readiness (0-100)
    user_skills = profile.get("skills", [])
    req_skills = business.get("required_skills", [])
    has_skill = any(s.lower() in [us.lower() for us in user_skills] for s in req_skills) if req_skills else True
    business_score = 100.0 if has_skill else 65.0

    # 3. Financial Readiness (0-100)
    cap = profile.get("available_capital", 0)
    min_inv = business.get("investment_min", 100000)
    financial_score = 100.0 if cap >= min_inv else 75.0 if (cap / max(1, min_inv)) >= 0.5 else 45.0

    # 4. Document Readiness (0-100)
    standard_docs = [
        "Aadhaar Card",
        "PAN Card",
        "Bank Statement (Last 6 Months)",
        "Detailed Project Report (DPR)",
        "Educational Qualification Certificate",
        "Rural Area Certificate"
    ]
    
    doc_checklist = {}
    provided_lower = [d.lower() for d in provided_documents]
    docs_present = 0
    
    for doc in standard_docs:
        present = any(doc.lower() in pd or pd in doc.lower() for pd in provided_lower)
        doc_checklist[doc] = present
        if present:
            docs_present += 1

    document_score = round((docs_present / len(standard_docs)) * 100.0, 1)

    # 5. Eligibility Readiness (0-100)
    eligibility_score = 90.0 if profile.get("experience_level") != "beginner" or profile.get("age", 25) >= 18 else 80.0

    # Overall Score
    overall = round(
        0.20 * profile_score +
        0.20 * business_score +
        0.20 * financial_score +
        0.20 * document_score +
        0.20 * eligibility_score, 1
    )

    missing = []
    if document_score < 100:
        missing_names = [k for k, v in doc_checklist.items() if not v]
        missing.append(f"Missing {len(missing_names)} key documents: {', '.join(missing_names[:3])}")
    if cap < min_inv:
        missing.append(f"Capital shortfall of ₹{min_inv - cap:,.0f} requires PMEGP/MUDRA loan application.")

    return {
        "overall_readiness_score": overall,
        "profile_readiness": profile_score,
        "business_readiness": business_score,
        "financial_readiness": financial_score,
        "document_readiness": document_score,
        "eligibility_readiness": eligibility_score,
        "missing_requirements": missing,
        "document_checklist": doc_checklist
    }
