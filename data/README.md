# DrishtiX Data Directory Guidelines

This directory contains raw and processed datasets used by the DrishtiX Hyper-Local Entrepreneurship Intelligence Platform.

## Directory Structure

- `raw/`: Place raw incoming datasets here (`.csv`, `.json`, `.xlsx`, `.parquet`).
- `processed/`: Standardized, cleaned, and deduplicated datasets.
- `features/`: Engineered features (demand index, competition density, resource availability).
- `schemes/`: Government scheme documents and metadata.
- `market/`: Local market price trends and demand indicators.
- `geospatial/`: Village, district, and infrastructural GIS data.
- `businesses/`: Controlled catalog of rural micro-enterprises.

## Dataset Drop-In Workflow (Real Data Mode)

When new datasets arrive:

1. Place raw file into `data/raw/`
2. Run data validation:
   ```bash
   python scripts/validate_data.py --input data/raw/your_file.csv
   ```
3. Run data cleaning and normalization:
   ```bash
   python scripts/process_data.py --input data/raw/your_file.csv
   ```
4. Build features and update vector embeddings:
   ```bash
   python scripts/build_features.py
   python scripts/build_embeddings.py
   ```
5. Ingest into database:
   ```bash
   python scripts/ingest_data.py
   ```

No code changes are required when replacing datasets! Customize column mappings in `data/schema_mapping.yaml` if needed.
