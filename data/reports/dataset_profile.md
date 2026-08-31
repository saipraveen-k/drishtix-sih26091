# DrishtiX Dataset Profiling & Inspection Report

Generated for 3 raw dataset files in `data/raw/`.

## Dataset: `demo_businesses.json` (JSON)
- **Total Rows**: 14
- **Total Columns**: 14
- **Missing Values**: 0 (0.0%)
- **Duplicate Rows**: 0
- **Geographic Columns**: `` 
- **Business Columns**: `name, category` 
- **Market Indicator Columns**: `resource_requirements, infrastructure_requirements, typical_cost_structure` 

### Numerical Ranges
| Column | Min | Max | Mean |
| --- | --- | --- | --- |
| `investment_min` | 40000.0 | 180000.0 | 94642.86 |
| `investment_max` | 100000.0 | 400000.0 | 212142.86 |
| `working_capital` | 15000.0 | 50000.0 | 28285.71 |

---

## Dataset: `demo_market_data.csv` (CSV)
- **Total Rows**: 8
- **Total Columns**: 13
- **Missing Values**: 0 (0.0%)
- **Duplicate Rows**: 0
- **Geographic Columns**: `state, district, village, pincode, latitude, longitude, population` 
- **Business Columns**: `` 
- **Market Indicator Columns**: `demand_index, competition_density, resource_score, infra_score` 

### Numerical Ranges
| Column | Min | Max | Mean |
| --- | --- | --- | --- |
| `pincode` | 221403.0 | 642001.0 | 464379.75 |
| `latitude` | 10.6609 | 26.6491 | 17.6 |
| `longitude` | 74.0371 | 82.8021 | 77.45 |
| `demand_index` | 77.0 | 90.0 | 83.88 |
| `competition_density` | 30.0 | 50.0 | 39.5 |
| `resource_score` | 75.0 | 88.0 | 80.5 |
| `infra_score` | 65.0 | 85.0 | 74.12 |
| `population` | 12800.0 | 28000.0 | 18150.0 |
| `nearest_market_km` | 1.5 | 8.0 | 4.78 |

### ⚠️ Data Anomaly Warnings
- Column 'population' contains out-of-India latitude values (12800.0 to 28000.0).

---

## Dataset: `demo_schemes.json` (JSON)
- **Total Rows**: 5
- **Total Columns**: 13
- **Missing Values**: 21 (32.31%)
- **Duplicate Rows**: 0
- **Geographic Columns**: `` 
- **Business Columns**: `name` 
- **Market Indicator Columns**: `max_project_cost` 

### Numerical Ranges
| Column | Min | Max | Mean |
| --- | --- | --- | --- |
| `max_project_cost` | 5000000.0 | 5000000.0 | 5000000.0 |
| `max_subsidy` | 1000000.0 | 1000000.0 | 1000000.0 |
| `max_loan` | 500000.0 | 20000000.0 | 7166666.67 |

---

