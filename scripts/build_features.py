"""
DrishtiX Feature Generator (Step 5)
Computes 10 composite indicators (0-100 scale) and stores them in data/features/.
"""

import os
import sys

# Ensure project root is in PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import json
import pandas as pd
import numpy as np
from ml.features.engineering import compute_normalized_features

def generate_features():
    curated_market_path = "data/curated/curated_market_data.csv"
    if not os.path.exists(curated_market_path):
        curated_market_path = "data/processed/processed_market_data.csv"

    if not os.path.exists(curated_market_path):
        print("[ERROR] Curated market data does not exist. Run process_data.py first.")
        return

    df = pd.read_csv(curated_market_path)
    df_feat = compute_normalized_features(df)

    os.makedirs("data/features", exist_ok=True)
    feat_path = "data/features/location_features.csv"
    df_feat.to_csv(feat_path, index=False)
    print(f"[SUCCESS] Generated 10 normalized features saved to {feat_path} ({len(df_feat)} locations)")

if __name__ == "__main__":
    generate_features()
