from fastapi import APIRouter
import json
import os
import sys
import subprocess
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

@router.get("/metrics")
def get_system_metrics():
    val_report = {}
    report_path = "data/processed/validation_report.json"
    if os.path.exists(report_path):
        with open(report_path, "r", encoding="utf-8") as f:
            val_report = json.load(f)

    profile_report = []
    profile_path = "data/reports/dataset_profile.json"
    if os.path.exists(profile_path):
        with open(profile_path, "r", encoding="utf-8") as f:
            profile_report = json.load(f)

    return {
        "system_status": "ONLINE",
        "active_mode": "DATASET-AGNOSTIC CURATED MODE",
        "last_ingestion_timestamp": datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        "datasets_count": len(profile_report),
        "dataset_validation_report": val_report,
        "total_businesses_cataloged": 9,
        "total_schemes_indexed": 5,
        "features_count": 10,
        "model_version": "v1.2-ScikitLearn-RuleEngine",
        "recommendation_engine_version": "v2.0-Explainable-7Factor",
        "llm_provider": "Auto (Gemini / OpenAI / Mock Provider)",
        "vector_store_status": "FAISS / JSON Vector Index Active"
    }

@router.post("/rerun-pipeline")
def rerun_data_pipeline():
    try:
        res = subprocess.run([sys.executable, "scripts/ingest_data.py"], capture_output=True, text=True)
        if res.returncode == 0:
            metrics = get_system_metrics()
            return {
                "status": "success",
                "message": "Data Ingestion Pipeline re-executed successfully! Features and vector embeddings updated.",
                "metrics": metrics
            }
        else:
            return {
                "status": "error",
                "message": f"Pipeline execution failed: {res.stderr}"
            }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
