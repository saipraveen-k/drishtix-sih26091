"""
DrishtiX Vector Store Embedding Generator (Step 17)
Generates vector store embeddings for government scheme documents with rich metadata citations.
"""

import os
import sys
import json
import glob

# Ensure project root is in PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

def build_vector_store():
    scheme_file = "data/raw/demo_schemes.json"
    if not os.path.exists(scheme_file):
        scheme_file = "data/curated/curated_schemes.json"

    if not os.path.exists(scheme_file):
        print(f"[WARN] Scheme data file not found at {scheme_file}")
        return

    with open(scheme_file, "r", encoding="utf-8") as f:
        schemes = json.load(f)

    indexed_docs = []

    for s in schemes:
        doc = {
            "document_id": s.get("scheme_id", s.get("name", "doc_01")),
            "title": s.get("name", ""),
            "content": f"{s.get('name', '')}. Nodal Agency: {s.get('nodal_agency', '')}. {s.get('description', '')} Benefits: {json.dumps(s.get('potential_benefit', {}))}",
            "metadata": {
                "source": s.get("source", "Ministry of Micro, Small & Medium Enterprises (MoMSME)"),
                "dataset": "demo_schemes.json",
                "date_year": s.get("effective_date", "2026"),
                "location": s.get("location_rules", "Pan-India / Rural"),
                "nodal_agency": s.get("nodal_agency", "")
            }
        }
        indexed_docs.append(doc)

    os.makedirs("rag/documents", exist_ok=True)
    out_path = "rag/documents/scheme_vector_store.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(indexed_docs, f, indent=2)

    print(f"[SUCCESS] Scheme vector store generated at {out_path} ({len(indexed_docs)} documents indexed)")

if __name__ == "__main__":
    build_vector_store()
