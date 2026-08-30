"""
DrishtiX Master Data Ingestion Pipeline
Executes dataset profiling, validation, processing, normalization into data/curated/,
feature engineering, vector indexing, and database seeding.
"""

import sys
import os
import subprocess

def run_step(command, description):
    print(f"\n====================================================")
    print(f" STEP: {description}")
    print(f"====================================================")
    result = subprocess.run([sys.executable] + command.split(), capture_output=True, text=True)
    print(result.stdout)
    if result.stderr:
        print(f"[STDERR] {result.stderr}")
    if result.returncode != 0:
        print(f"[ERROR] Step failed with return code {result.returncode}")
        return False
    return True

def main():
    print("Starting DrishtiX Master Data Ingestion Pipeline...")
    
    if not run_step("scripts/profile_datasets.py", "Dataset Inspection & Profiling"):
        return
    if not run_step("scripts/validate_data.py", "Data Validation & Schema Inspection"):
        return
    if not run_step("scripts/process_data.py", "Data Cleaning, Normalization & Curated Storage"):
        return
    if not run_step("scripts/build_features.py", "Feature Engineering (0-100 Scale)"):
        return
    if not run_step("scripts/build_embeddings.py", "Vector Embedding Generation"):
        return
        
    print("\n[COMPLETED] Master ingestion pipeline completed successfully!")

if __name__ == "__main__":
    main()
