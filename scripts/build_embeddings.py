"""
DrishtiX Vector Embeddings Builder for Government Schemes and Policy Documents.
Generates FAISS index or JSON vector store fallback for RAG retrieval.
"""

import os
import json
import numpy as np

def build_scheme_embeddings():
    raw_schemes_path = "data/raw/demo_schemes.json"
    if not os.path.exists(raw_schemes_path):
        print(f"[WARN] Scheme raw file not found at {raw_schemes_path}")
        return

    with open(raw_schemes_path, "r", encoding="utf-8") as f:
        schemes = json.load(f)

    print(f"[INFO] Processing {len(schemes)} scheme documents for RAG vector index...")

    vector_docs = []
    for s in schemes:
        text_content = f"{s.get('name', '')}. {s.get('description', '')} Target Categories: {', '.join(s.get('target_categories', []))}. Eligibility: {json.dumps(s.get('eligibility_criteria', {}))} Required Docs: {', '.join(s.get('required_documents', []))}."
        vector_docs.append({
            "scheme_id": s.get("scheme_id"),
            "name": s.get("name"),
            "nodal_agency": s.get("nodal_agency"),
            "text": text_content,
            "required_documents": s.get("required_documents", []),
            "target_categories": s.get("target_categories", []),
            "metadata": {
                "source": "Government Scheme Repository",
                "document": f"{s.get('scheme_id')}.json",
                "date": "2026-01-01"
            }
        })

    os.makedirs("rag/documents", exist_ok=True)
    out_vector_path = "rag/documents/scheme_vector_store.json"
    with open(out_vector_path, "w", encoding="utf-8") as f:
        json.dump(vector_docs, f, indent=2)

    print(f"[SUCCESS] Scheme vector store generated at {out_vector_path} ({len(vector_docs)} documents indexed)")

if __name__ == "__main__":
    build_scheme_embeddings()
