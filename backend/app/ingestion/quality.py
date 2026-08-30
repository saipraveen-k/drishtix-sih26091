"""
DrishtiX Data Quality Engine & Location Resolution (Step 5 & 6)
Performs 10-point data validation, location normalization, proxy detection, and quality rating.
"""

from typing import Dict, Any, List
import pandas as pd
import numpy as np

def run_data_quality_checks(df: pd.DataFrame, file_name: str = "") -> Dict[str, Any]:
    rows, cols = df.shape
    if rows == 0 or cols == 0:
        return {
            "file_name": file_name,
            "status": "REJECTED",
            "quality_rating": "LOW",
            "score": 0,
            "issues": ["Dataset is completely empty."],
            "rows_processed": 0,
            "rows_rejected": 0,
            "coverage_level": "Unspecified",
            "is_proxy": True
        }

    issues = []
    rejected_rows = 0

    # 1. Missing values check
    null_count = int(df.isnull().sum().sum())
    null_pct = round((null_count / (rows * cols)) * 100, 2)
    if null_pct > 30:
        issues.append(f"High missing value density ({null_pct}% missing).")

    # 2. Duplicate records check
    df_str = df.astype(str)
    dup_count = int(df_str.duplicated().sum())
    if dup_count > 0:
        issues.append(f"Detected {dup_count} duplicate row(s).")
        rejected_rows += dup_count

    # 3. Geographic Coverage & Proxy Detection
    has_village = any("village" in c.lower() for c in df.columns)
    has_coords = any("lat" in c.lower() for c in df.columns)
    
    if has_village and has_coords:
        coverage_level = "Village-level granular"
        is_proxy = False
    elif has_village:
        coverage_level = "Village-level without coordinates"
        is_proxy = False
    else:
        coverage_level = "District-level proxy"
        is_proxy = True
        issues.append("Village coordinates unverified; using District-level proxy aggregation.")

    # 4. Invalid coordinates check
    lat_cols = [c for c in df.columns if "lat" in c.lower()]
    lon_cols = [c for c in df.columns if "lon" in c.lower() or "lng" in c.lower()]
    
    if lat_cols:
        invalid_lats = df[(df[lat_cols[0]] < 6.0) | (df[lat_cols[0]] > 38.0)]
        if len(invalid_lats) > 0:
            issues.append(f"{len(invalid_lats)} record(s) contain invalid latitude coordinates outside India.")
            rejected_rows += len(invalid_lats)

    if lon_cols:
        invalid_lons = df[(df[lon_cols[0]] < 68.0) | (df[lon_cols[0]] > 98.0)]
        if len(invalid_lons) > 0:
            issues.append(f"{len(invalid_lons)} record(s) contain invalid longitude coordinates outside India.")

    # 5. Rating assignment
    score = 100
    if null_pct > 10:
        score -= 20
    if dup_count > 0:
        score -= 15
    if is_proxy:
        score -= 10
    if len(issues) > 2:
        score -= 20

    final_score = max(0, score)
    if final_score >= 80:
        rating = "HIGH"
    elif final_score >= 50:
        rating = "MEDIUM"
    else:
        rating = "LOW"

    return {
        "file_name": file_name,
        "quality_rating": rating,
        "score": final_score,
        "total_rows": rows,
        "rows_processed": max(0, rows - rejected_rows),
        "rows_rejected": rejected_rows,
        "missing_pct": null_pct,
        "duplicate_rows": dup_count,
        "coverage_level": coverage_level,
        "is_proxy": is_proxy,
        "issues": issues
    }
