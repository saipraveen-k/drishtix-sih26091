"""
DrishtiX Dataset Profiling and Inspection Tool (Step 3)
Inspects raw datasets in data/raw/ (.csv, .xlsx, .json, .parquet) and generates dataset_profile.json and dataset_profile.md.
Does NOT modify raw files.
"""

import os
import glob
import json
import pandas as pd
import numpy as np

def inspect_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    filename = os.path.basename(file_path)
    
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
            return None
    except Exception as e:
        return {"filename": filename, "error": str(e)}

    rows, cols = df.shape
    columns = list(df.columns)
    data_types = {str(col): str(dtype) for col, dtype in df.dtypes.items()}
    
    # Missing values
    null_counts = df.isnull().sum()
    missing_dict = {str(k): int(v) for k, v in null_counts.items() if v > 0}
    total_nulls = int(null_counts.sum())
    missing_pct = round((total_nulls / (rows * cols if cols > 0 else 1)) * 100, 2)
    
    # Duplicates (convert list/dict columns to str for unhashable check)
    df_str = df.astype(str)
    duplicates = int(df_str.duplicated().sum())

    # Field categorization
    geo_cols = [c for c in columns if any(k in c.lower() for k in ["lat", "lon", "lng", "state", "district", "block", "mandal", "village", "pincode", "zip"])]
    biz_cols = [c for c in columns if any(k in c.lower() for k in ["business", "name", "category", "enterprise", "activity", "item"])]
    market_cols = [c for c in columns if any(k in c.lower() for k in ["demand", "competition", "resource", "infra", "price", "cost"])]

    # Unique values for key fields if present
    unique_states = []
    unique_districts = []
    unique_blocks = []
    unique_locations = []

    for c in columns:
        c_lower = c.lower()
        if "state" in c_lower:
            unique_states = df[c].dropna().astype(str).unique().tolist()[:10]
        if "district" in c_lower:
            unique_districts = df[c].dropna().astype(str).unique().tolist()[:10]
        if "block" in c_lower or "mandal" in c_lower:
            unique_blocks = df[c].dropna().astype(str).unique().tolist()[:10]
        if "village" in c_lower or "location" in c_lower:
            unique_locations = df[c].dropna().astype(str).unique().tolist()[:10]

    # Outliers / Suspicious numerical values
    num_cols = df.select_dtypes(include=[np.number]).columns
    num_ranges = {}
    suspicious = []

    for nc in num_cols:
        col_min = float(df[nc].min())
        col_max = float(df[nc].max())
        num_ranges[str(nc)] = {"min": col_min, "max": col_max, "mean": round(float(df[nc].mean()), 2)}

        if "lat" in nc.lower() and (col_min < 6.0 or col_max > 38.0):
            suspicious.append(f"Column '{nc}' contains out-of-India latitude values ({col_min} to {col_max}).")
        if "lon" in nc.lower() and (col_min < 68.0 or col_max > 98.0):
            suspicious.append(f"Column '{nc}' contains out-of-India longitude values ({col_min} to {col_max}).")

    profile_data = {
        "filename": filename,
        "format": ext.replace(".", "").upper(),
        "rows": rows,
        "columns": cols,
        "column_names": columns,
        "data_types": data_types,
        "missing_values_count": total_nulls,
        "missing_values_pct": missing_pct,
        "missing_per_column": missing_dict,
        "duplicate_rows": duplicates,
        "geographic_columns": geo_cols,
        "business_columns": biz_cols,
        "market_columns": market_cols,
        "unique_states_sample": unique_states,
        "unique_districts_sample": unique_districts,
        "unique_blocks_sample": unique_blocks,
        "unique_locations_sample": unique_locations,
        "numerical_ranges": num_ranges,
        "suspicious_values": suspicious
    }
    return profile_data

def run_dataset_profiler(raw_dir="data/raw"):
    print("Running DrishtiX Dataset Profiler...")
    raw_files = glob.glob(os.path.join(raw_dir, "*.*"))
    profiles = []

    for f in raw_files:
        p = inspect_file(f)
        if p:
            profiles.append(p)

    os.makedirs("data/reports", exist_ok=True)
    json_path = "data/reports/dataset_profile.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(profiles, f, indent=2)

    # Generate Markdown Report
    md_path = "data/reports/dataset_profile.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("# DrishtiX Dataset Profiling & Inspection Report\n\n")
        f.write(f"Generated for {len(profiles)} raw dataset files in `data/raw/`.\n\n")

        for p in profiles:
            f.write(f"## Dataset: `{p['filename']}` ({p['format']})\n")
            f.write(f"- **Total Rows**: {p['rows']}\n")
            f.write(f"- **Total Columns**: {p['columns']}\n")
            f.write(f"- **Missing Values**: {p['missing_values_count']} ({p['missing_values_pct']}%)\n")
            f.write(f"- **Duplicate Rows**: {p['duplicate_rows']}\n")
            f.write(f"- **Geographic Columns**: `{', '.join(p['geographic_columns'])}` \n")
            f.write(f"- **Business Columns**: `{', '.join(p['business_columns'])}` \n")
            f.write(f"- **Market Indicator Columns**: `{', '.join(p['market_columns'])}` \n\n")

            if p["numerical_ranges"]:
                f.write("### Numerical Ranges\n")
                f.write("| Column | Min | Max | Mean |\n")
                f.write("| --- | --- | --- | --- |\n")
                for col, r in p["numerical_ranges"].items():
                    f.write(f"| `{col}` | {r['min']} | {r['max']} | {r['mean']} |\n")
                f.write("\n")

            if p["suspicious_values"]:
                f.write("### ⚠️ Data Anomaly Warnings\n")
                for warn in p["suspicious_values"]:
                    f.write(f"- {warn}\n")
                f.write("\n")

            f.write("---\n\n")

    print(f"[SUCCESS] Saved dataset profiles to {json_path} and {md_path}")
    return profiles

if __name__ == "__main__":
    run_dataset_profiler()
