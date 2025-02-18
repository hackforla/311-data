"""
--------------------------------------------------------------------------------
Purpose: This script fetches column names from various dataset URLs 
         without downloading the entire dataset. It then compares column 
         structures between different years and highlights differences.

Motivation:
- Full dataset downloads are time-consuming and unnecessary for column consistency analysis.
- This script efficiently extracts only the column names using `nrows=1`.
- Helps developers quickly analyze schema changes across years.

Key Features:
- Uses HTTP requests to fetch CSV data from `data.lacity.org` APIs.
- Reads only the first row (`nrows=1`) to extract column names efficiently.
- Compares column structures of historical datasets against the 2024 dataset.
- Identifies missing and additional columns in each year.

Time to execute: 
- Due to multiple API calls the code might take time to execute 
--------------------------------------------------------------------------------
"""

import pandas as pd
import requests
from io import StringIO

# Dictionary of dataset URLs with metadata request using $SELECT=*
dataset_urls = {
    "2015": "https://data.lacity.org/api/views/ms7h-a45h/rows.csv?accessType=DOWNLOAD&$SELECT=*",
    "2016": "https://data.lacity.org/api/views/ndkd-k878/rows.csv?accessType=DOWNLOAD&$SELECT=*",
    "2017": "https://data.lacity.org/api/views/d4vt-q4t5/rows.csv?accessType=DOWNLOAD&$SELECT=*",
    "2018": "https://data.lacity.org/api/views/h65r-yf5i/rows.csv?accessType=DOWNLOAD&$SELECT=*",
    "2019": "https://data.lacity.org/api/views/pvft-t768/rows.csv?accessType=DOWNLOAD&$SELECT=*",
    "2024": "https://data.lacity.org/api/views/b7dx-7gc3/rows.csv?accessType=DOWNLOAD&$SELECT=*"
}

def fetch_columns(url):
    """
    Fetches only the first row of the dataset from a given URL to extract column names.

    Args:
    - url (str): The dataset URL.

    Returns:
    - set: A set of column names from the dataset.
    """
    try:
        headers = {"User-Agent": "Mozilla/5.0"}  # Helps prevent request blocking
        response = requests.get(url, headers=headers, timeout=10)  # Fetch data from URL
        response.raise_for_status()  # Raise error for HTTP issues

        # Read only the first row from the dataset and extract column names
        df = pd.read_csv(StringIO(response.text), nrows=1, encoding="utf-8")
        return set(df.columns)

    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from {url}: {e}")
    except pd.errors.EmptyDataError:
        print(f"Empty data returned from {url}")
    except Exception as e:
        print(f"Unexpected error: {e}")

    return set()  # Return an empty set if an error occurs

# Fetch column names for the 2024 dataset (used as the reference for comparison)
columns_2024 = fetch_columns(dataset_urls["2024"])
count_2024 = len(columns_2024)

# Dictionary to store column count and differences for each year
column_differences = {}

# Loop through each dataset and compare with the 2024 dataset
for year, url in dataset_urls.items():
    if year == "2024":
        continue  # Skip 2024 itself since it's the reference

    # Fetch column names for the current year
    columns_year = fetch_columns(url)
    count_year = len(columns_year)

    # Compute differences in columns
    missing_in_year = columns_2024 - columns_year  # Columns present in 2024 but missing in the given year
    additional_in_year = columns_year - columns_2024  # Columns present in the given year but not in 2024

    # Store comparison results
    column_differences[year] = {
        "count_year": count_year,  
        "count_2024": count_2024,  
        "missing_in_year": missing_in_year if missing_in_year else "None",
        "additional_in_year": additional_in_year if additional_in_year else "None"
    }

# Print results for each year
for year, diff in column_differences.items():
    print(f"\nComparison of columns between {year} and 2024:")
    print(f"Total columns in {year}: {diff['count_year']}")
    print(f"Total columns in 2024: {diff['count_2024']}")
    print("Columns missing in", year, ":", diff["missing_in_year"])
    print("Additional columns in", year, ":", diff["additional_in_year"])
