"""
DrishtiX Data Processing and Normalization Script (Step 4)
Cleans raw datasets, renames columns according to schema_mapping.yaml, handles missing values,
and saves curated outputs into data/curated/ without touching raw files.
"""

import os
import sys
import yaml
import json
import argparse
import pandas as pd
import numpy as np

# Ensure project root is in PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.ingestion.quality import run_data_quality_checks

def load_schema_mapping(mapping_path="data/schema_mapping.yaml"):
    if os.path.exists(mapping_path):
        with open(mapping_path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f).get("column_mappings", {})
    return {}

def process_market_data(input_path="data/raw/demo_market_data.csv"):
    if not os.path.exists(input_path):
        print(f"[WARN] Market data file not found at {input_path}")
        return

    df = pd.read_csv(input_path)
    mappings = load_schema_mapping()

    # 1. Quality Check
    q_report = run_data_quality_checks(df, file_name=os.path.basename(input_path))
    print(f"[QUALITY REPORT] Rating: {q_report['quality_rating']} | Score: {q_report['score']}/100 | Rows Processed: {q_report['rows_processed']}")

    # 2. Rename columns based on mapping
    rename_dict = {}
    for target_col, aliases in mappings.items():
        for col in df.columns:
            if col in aliases and target_col not in df.columns:
                rename_dict[col] = target_col
    df = df.rename(columns=rename_dict)

    # 3. String Normalization (Title case state, district, village)
    for col in ["state", "district", "village"]:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip().str.title()

    # 4. Fill numerical missing values with median
    num_cols = df.select_dtypes(include=[np.number]).columns
    for c in num_cols:
        df[c] = df[c].fillna(df[c].median())

    # 5. Save to processed and curated folders
    os.makedirs("data/processed", exist_ok=True)
    os.makedirs("data/curated", exist_ok=True)

    proc_path = "data/processed/processed_market_data.csv"
    curated_path = "data/curated/curated_market_data.csv"

    df.to_csv(proc_path, index=False)
    df.to_csv(curated_path, index=False)

    print(f"[SUCCESS] Curated market data saved to {curated_path} ({len(df)} rows)")

def process_business_catalog(input_path="data/raw/demo_businesses.json"):
    if not os.path.exists(input_path):
        print(f"[WARN] Business catalog not found at {input_path}")
        return

    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    os.makedirs("data/processed", exist_ok=True)
    os.makedirs("data/curated", exist_ok=True)

    proc_path = "data/processed/processed_businesses.json"
    curated_path = "data/curated/curated_businesses.json"

    with open(proc_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    with open(curated_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    print(f"[SUCCESS] Curated business catalog saved to {curated_path} ({len(data)} items)")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="DrishtiX Data Processor")
    parser.add_argument("--input", default="data/raw/demo_market_data.csv")
    args = parser.parse_args()
    process_market_data(args.input)
    process_business_catalog()
