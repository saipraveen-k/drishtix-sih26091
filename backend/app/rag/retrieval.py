"""
DrishtiX RAG Document Retrieval Module
Retrieves matching government scheme and policy documents from vector store with source metadata.
"""

import os
import json
from typing import List, Dict, Any

def retrieve_relevant_documents(query: str, top_k: int = 2) -> List[Dict[str, Any]]:
    vector_store_path = "rag/documents/scheme_vector_store.json"
    if not os.path.exists(vector_store_path):
        return []

    try:
        with open(vector_store_path, "r", encoding="utf-8") as f:
            docs = json.load(f)
    except Exception:
        return []

    q_lower = query.lower()
    scored_docs = []

    for d in docs:
        text = d.get("text", "").lower()
        score = 0
        # Simple keyword vector similarity score
        keywords = q_lower.split()
        for kw in keywords:
            if len(kw) > 3 and kw in text:
                score += 1
        scored_docs.append((score, d))

    scored_docs.sort(key=lambda x: x[0], reverse=True)
    results = [item[1] for item in scored_docs[:top_k]]
    return results
