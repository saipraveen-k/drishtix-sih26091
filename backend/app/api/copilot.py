from fastapi import APIRouter
from backend.app.schemas.schemas import CopilotChatRequest, CopilotChatResponse
from backend.app.ai.provider import get_llm_provider
from backend.app.rag.retrieval import retrieve_relevant_documents

router = APIRouter(prefix="/copilot", tags=["AI Copilot Advisor"])

@router.post("/chat", response_model=CopilotChatResponse)
def copilot_chat(req: CopilotChatRequest):
    provider = get_llm_provider()
    
    # RAG vector document lookup
    docs = retrieve_relevant_documents(req.question, top_k=2)
    sources = [f"{d.get('name')} ({d.get('metadata', {}).get('source')})" for d in docs] if docs else ["DrishtiX Verified Business Catalog"]

    sys_context = f"Entrepreneur Context: {req.context}"
    ans = provider.generate_chat_response(req.question, sys_context, docs, req.language or "en")

    followups = [
        "Why did you recommend this business?",
        "What happens if sales fall by 20%?",
        "Explain break-even in simple terms.",
        "What documents are missing for PMEGP loan application?"
    ]

    return CopilotChatResponse(
        answer=ans,
        sources_used=sources,
        suggested_followups=followups
    )
