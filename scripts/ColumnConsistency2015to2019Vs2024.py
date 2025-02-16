import pandas as pd
import requests
from io import StringIO
import time

# Dictionary of dataset URLs (from data.lacity.org)
dataset_urls = {
    "2015": "https://data.lacity.org/api/views/ms7h-a45h/rows.csv?accessType=DOWNLOAD",
    "2016": "https://data.lacity.org/api/views/ndkd-k878/rows.csv?accessType=DOWNLOAD",
    "2017": "https://data.lacity.org/api/views/d4vt-q4t5/rows.csv?accessType=DOWNLOAD",
    "2018": "https://data.lacity.org/api/views/h65r-yf5i/rows.csv?accessType=DOWNLOAD",
    "2019": "https://data.lacity.org/api/views/pvft-t768/rows.csv?accessType=DOWNLOAD",
    "2024": "https://data.lacity.org/api/views/b7dx-7gc3/rows.csv?accessType=DOWNLOAD"
}

def fetch_columns(url, retries=3, timeout=10):
    """Fetch only the first row of the dataset to get column names efficiently with retries."""
    attempt = 0
    headers = {"User-Agent": "Mozilla/5.0"}

    while attempt < retries:
        try:
            response = requests.get(url, headers=headers, stream=True, timeout=timeout)
            response.raise_for_status()

            df = pd.read_csv(StringIO(response.text), nrows=1)
            return set(df.columns)

        except (requests.Timeout, requests.ConnectionError) as e:
            print(f"Network error fetching {url}: {e}. Retrying ({attempt+1}/{retries})...")
        except (requests.RequestException, pd.errors.EmptyDataError) as e:
            print(f"Data error for {url}: {e}. Retrying ({attempt+1}/{retries})...")
        except Exception as e:
            print(f"Unexpected error: {e}")
        
        attempt += 1
        time.sleep(2)
    
    print(f"Failed to fetch data from {url} after {retries} attempts.")
    return set()

# Fetch 2024 dataset column names
columns_2024 = fetch_columns(dataset_urls["2024"])
count_2024 = len(columns_2024)

# Dictionary to store column count and differences for each year
column_differences = {}

for year, url in dataset_urls.items():
    if year == "2024":
        continue

    columns_year = fetch_columns(url)
    count_year = len(columns_year)

    missing_in_year = columns_2024 - columns_year
    additional_in_year = columns_year - columns_2024

    column_differences[year] = {
        "count_year": count_year,
        "count_2024": count_2024,
        "missing_in_year": missing_in_year if missing_in_year else "None",
        "additional_in_year": additional_in_year if additional_in_year else "None"
    }

# Print results
for year, diff in column_differences.items():
    print(f"\nComparison of columns between {year} and 2024:")
    print(f"Total columns in {year}: {diff['count_year']}")
    print(f"Total columns in 2024: {diff['count_2024']}")
    print("Columns missing in", year, ":", diff["missing_in_year"])
    print("Additional columns in", year, ":", diff["additional_in_year"])
