import duckdb
import requests
import os
import glob
from tqdm import tqdm
from huggingface_hub import HfApi, login
from dotenv import load_dotenv
from datetime import datetime
load_dotenv()


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


year_to_retrieve = datetime.now().year
current_month = datetime.now().month  # this is the current month in integer form
if current_month < 4:
    # The data is not made available until 2nd quarter of the year. Retrieve the last year's worth of data instead.
    year_to_retrieve -= 1

def dlData():
    '''
    Download the current year's dataset from data.lacity.org
    '''
    url = "https://data.lacity.org/api/views/h73f-gn57/rows.csv?accessType=DOWNLOAD"
    outfile = f'{year_to_retrieve}.csv'

    response = requests.get(url, stream=True)

    # Save downloaded file
    with open(outfile, "wb") as file:
        for data in tqdm(response.iter_content()):
            file.write(data)


def hfClean():
    '''
    Clean the dataset by removing problematic string combinations and update timestamp to ISO format
    '''

    infile = f'{year_to_retrieve}.csv'
    fixed_filename = f'{year_to_retrieve}-fixed.csv'
    clean_filename = f'{year_to_retrieve}-clean.parquet'

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


def hfUpload():
    '''
    Upload the clean dataset to huggingface.co
    '''
    local_filename = f'{year_to_retrieve}-clean.parquet'
    dest_filename = f'{year_to_retrieve}.parquet'
    repo_name = f'{year_to_retrieve}'
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
    dlData()
    hfClean()
    hfUpload()
    cleanUp()


main()
