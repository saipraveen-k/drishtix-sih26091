"""
DrishtiX Dataset Inspector and Validation Tool
Validates incoming raw datasets against schema_mapping.yaml and outputs a data quality report.
"""

import sys
import os
import json
import argparse
import yaml
import pandas as pd
import numpy as np

def load_schema_mapping(mapping_path="data/schema_mapping.yaml"):
    if os.path.exists(mapping_path):
        with open(mapping_path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f).get("column_mappings", {})
    return {}

def inspect_and_validate(file_path):
    print(f"\n====================================================")
    print(f" DRISHTIX DATA QUALITY & SCHEMA INSPECTOR")
    print(f" File: {file_path}")
    print(f"====================================================\n")

    if not os.path.exists(file_path):
        print(f"[ERROR] File not found: {file_path}")
        return False

    # Load file
    ext = os.path.splitext(file_path)[1].lower()
    try:
        if ext == ".csv":
            df = pd.read_csv(file_path)
        elif ext == ".json":
            df = pd.read_json(file_path)
        elif ext in [".xlsx", ".xls"]:
            df = pd.read_excel(file_path)
        elif ext == ".parquet":
            df = pd.read_parquet(file_path)
        else:
            print(f"[ERROR] Unsupported file extension: {ext}")
            return False
    except Exception as e:
        print(f"[ERROR] Failed to read dataset: {e}")
        return False

    rows, cols = df.shape
    print(f"Total Rows: {rows}")
    print(f"Total Columns: {cols}")
    print(f"Column Names: {list(df.columns)}")

    # Check missing values
    null_counts = df.isnull().sum()
    total_nulls = null_counts.sum()
    total_cells = rows * cols if cols > 0 else 1
    null_pct = (total_nulls / total_cells) * 100

    # Duplicates
    dup_count = df.duplicated().sum()

    # Column Mapping Check
    mappings = load_schema_mapping()
    mapped_found = {}
    for target_col, aliases in mappings.items():
        match = [c for c in df.columns if c in aliases]
        if match:
            mapped_found[target_col] = match[0]

    print("\n--- SCHEMA MAPPING REPORT ---")
    for target_col, found in mapped_found.items():
        print(f"  [MATCHED] Standard field '{target_col}' <-- Raw column '{found}'")

    unmapped = set(mappings.keys()) - set(mapped_found.keys())
    if unmapped:
        print(f"  [UNMAPPED] Optional/missing standard fields: {list(unmapped)}")

    # Quality Rating Calculation
    quality = "HIGH"
    if null_pct > 20 or dup_count > (rows * 0.1):
        quality = "MEDIUM"
    if null_pct > 40 or len(mapped_found) == 0:
        quality = "LOW"

    print("\n--- DATA QUALITY SUMMARY ---")
    print(f"  Missing Values: {total_nulls} ({null_pct:.2f}%)")
    print(f"  Duplicate Rows: {dup_count}")
    print(f"  Overall Data Quality: {quality}")
    print("====================================================\n")

    report = {
        "file_path": file_path,
        "rows": rows,
        "columns": cols,
        "null_pct": round(null_pct, 2),
        "duplicates": int(dup_count),
        "mapped_columns": mapped_found,
        "quality": quality
    }
    
    # Save report
    os.makedirs("data/processed", exist_ok=True)
    report_path = os.path.join("data/processed", "validation_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
        
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="DrishtiX Data Inspector")
    parser.add_argument("--input", default="data/raw/demo_market_data.csv", help="Path to dataset")
    args = parser.parse_args()
    inspect_and_validate(args.input)
