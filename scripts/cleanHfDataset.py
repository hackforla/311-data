import duckdb
import requests
import os
import glob
from tqdm import tqdm
from huggingface_hub import HfApi, login
from dotenv import load_dotenv
import sys

load_dotenv()

def dlData(year):
    '''
    Download the dataset from huggingface
    '''
    url = f"https://huggingface.co/datasets/edwinjue/311-data-{year}/resolve/main/{year}.csv"
    outfile = f"{year}.csv"
    response = requests.get(url, stream=True)

    # Save downloaded file
    with open(outfile, "wb") as file:
        for data in tqdm(response.iter_content()):
            file.write(data)


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
            f"create table requests as select * from read_csv_auto('{fixed_filename}', header=True, timestampformat='%m/%d/%Y %H:%M:%S %p');")
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


def process_data(year):
    dlData(year)
    hfClean(year)
    hfUpload(year)
    cleanUp()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python one_time_script.py <year>")
        sys.exit(1)

    year = sys.argv[1]
    process_data(year)
