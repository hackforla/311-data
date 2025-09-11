'''
This script downloads the selected year's csv file from Edwin's HuggingFace (which we no longer use),
and transform the csv into a parquet file, creates the selected year's repo on 311-Data's HuggingFace and
uploads the parquet file.

This is only use for migrating older years' data for case-by-case usage, not to be confused with the
daily cron-job.

To process an older year's data, run the script with Python in the terminal with input year:
ie.: `python3 cleanOldHfDataset.py 2022`, make sure to change the year to your intended year
'''

import duckdb
import requests
import os
import glob
from tqdm import tqdm
from huggingface_hub import HfApi, login
from dotenv import load_dotenv
import sys
import logging

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def dlData(year):
    '''
    Download the dataset from Edwin's huggingface
    '''
    url = f"https://huggingface.co/datasets/edwinjue/311-data-{year}/resolve/main/{year}.csv"
    outfile = f"{year}.csv"
    chunk_size = 1024 * 1024 # 1 MB

    response = requests.get(url, stream=True)

    # Save downloaded file
    with open(outfile, "wb") as file:
        for chunk in tqdm(response.iter_content(chunk_size=chunk_size), desc="Downloading data"):
            if chunk:  # filter out keep-alive new chunks
                file.write(chunk)

    logging.info(f"Downloaded {outfile} successfully.")


def hfClean(year):
    '''
    Clean the dataset by removing problematic string combinations and update timestamp to ISO format
    '''
    infile = f"{year}.csv"
    fixed_filename = f"{year}-fixed.csv"
    clean_filename = f"{year}-clean.parquet"

    # List of problematic strings to be replaced with ""
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
            f"create table requests as select * from read_csv_auto('{fixed_filename}', header=True, timestampformat='%m/%d/%Y %H:%M:%S %p', parallel=false);")
        conn.execute(
            f"copy (select * from requests) to '{clean_filename}' with (FORMAT PARQUET);")

    except FileNotFoundError:
        print(f"File {infile} not found.")


def hfUpload(year):
    '''
    Upload the clean dataset to huggingface.co
    '''
    local_filename = f"{year}-clean.parquet"
    dest_filename = f"{year}.parquet"
    username = '311-data'
    repo_name = str(year)
    repo_type = 'dataset'

    repo_id = f"{username}/{repo_name}"
    TOKEN = os.getenv('HUGGINGFACE_LOGIN_TOKEN')

    login(TOKEN)
    api = HfApi()

    # Check if the repository exists, and create it if it doesn't
    try:
        api.repo_info(repo_id)
    except:
        api.create_repo(repo_id, repo_type=repo_type, exist_ok=True)

    # Upload the file to the repository
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


def process_data(year, skip_download=False, skip_clean=False, stop_after_clean=False):
    if not skip_download:
        dlData(year)
    if not skip_clean:
        hfClean(year)
    if stop_after_clean:
        logging.info("Stopping after hfClean as requested.")
        return
    hfUpload(year)
    cleanUp()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python one_time_script.py <year> [--skip-download] [--skip-clean] [--stop-after-clean]")
        sys.exit(1)

    year = sys.argv[1]
    skip_download = '--skip-download' in sys.argv
    skip_clean = '--skip-clean' in sys.argv
    stop_after_clean = '--stop-after-clean' in sys.argv
    process_data(year, skip_download, skip_clean, stop_after_clean)
