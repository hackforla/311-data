import duckdb
import requests
import os
import glob
from tqdm import tqdm
from huggingface_hub import HfApi, login
from dotenv import load_dotenv
from datetime import datetime
load_dotenv()

# Lookup table for data URLs by year
DATA_URLS = {
    '2025': 'https://data.lacity.org/api/views/h73f-gn57/rows.csv?accessType=DOWNLOAD',
    '2026': 'https://data.lacity.org/api/v3/views/2cy6-i7zn/query.csv',
}

def get_current_year():
    return str(datetime.now().year)

# set environment as 'dev' or 'prod'
ENV = os.getenv('VITE_ENV')

if ENV == 'DEV':
    HF_USERNAME = '311-Data-Dev'
elif ENV == 'PROD':
    HF_USERNAME = '311-data'
else:
  # exit out of the program with an error message
  print('Incorrect environment variable set for VITE_ENV.')
  exit(1)

def dlData():
    '''
    Download the current year's dataset from data.lacity.org.
    Returns the year, so it can be passed to subsequent steps.
    '''
    year = get_current_year()
    if year not in DATA_URLS:
        raise ValueError(f"No data URL configured for year {year}")
    url = DATA_URLS[year]
    outfile = f"{year}.csv"

    response = requests.get(url, stream=True)

    # If we get a 4xx or 5xx HTTP status, raise an exception and stop processing altogether
    response.raise_for_status()

    # Save downloaded file
    with open(outfile, "wb") as file:
        for data in tqdm(response.iter_content()):
            file.write(data)

    return year


def hfClean(year=None):
    '''
    Clean the dataset by removing problematic string combinations and update timestamp to ISO format
    '''
    if year is None:
        year = get_current_year()
    infile = f"{year}.csv"
    fixed_filename = f"{year}-fixed.csv"
    clean_filename = f"{year}-clean.parquet"

    # List of problmenatic strings to be replaced with ""
    replace_strings = ["VE, 0"]

    conn = duckdb.connect(database=':memory:')

    try:
        # Clean and save modified file
        with open(infile, "r") as input_file, open(fixed_filename, "w") as output_file:
            for line in input_file:
                for replace_string in replace_strings:
                    line = line.replace(replace_string, "")
                output_file.write(line)

        # Open modified file and perform an import/export to duckdb to ensure timestamps are formatted correctly
        conn.execute(
            f"create table requests as select * from read_csv_auto('{fixed_filename}', header=True, timestampformat='%m/%d/%Y %H:%M:%S %p');")
        conn.execute(
            f"copy (select * from requests) to '{clean_filename}' with (FORMAT PARQUET);")

    except FileNotFoundError:
        print(f"File {infile} not found.")


def hfUpload(year=None):
    '''
    Upload the clean dataset to huggingface.co
    '''
    if year is None:
        year = get_current_year()
    local_filename = f'{year}-clean.parquet'
    dest_filename = f'{year}.parquet'
    repo_name = f'{year}'
    repo_type = 'dataset'

    repo_id = f"{HF_USERNAME}/{repo_name}"
    TOKEN = os.getenv('HUGGINGFACE_LOGIN_TOKEN')

    login(TOKEN)
    api = HfApi()
    api.upload_file(
        path_or_fileobj=local_filename,
        path_in_repo=dest_filename,
        repo_id=repo_id,
        repo_type=repo_type,
    )


def cleanUp():
    for file in glob.glob('*.csv'):
        os.remove(file)
    for file in glob.glob('*.parquet'):
        os.remove(file)


def main():
    year = dlData()
    hfClean(year)
    hfUpload(year)
    cleanUp()


main()
