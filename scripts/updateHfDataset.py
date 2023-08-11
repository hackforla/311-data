import duckdb
import requests
import os
import glob
from tqdm import tqdm
from huggingface_hub import HfApi, login
from dotenv import load_dotenv
load_dotenv()


def dlData():
    '''
    Download the dataset from data.lacity.org
    '''
    url = "https://data.lacity.org/api/views/4a4x-mna2/rows.csv?accessType=DOWNLOAD"
    outfile = "2023.csv"

    response = requests.get(url, stream=True)

    # Save downloaded file
    with open(outfile, "wb") as file:
        for data in tqdm(response.iter_content()):
            file.write(data)


def hfClean():
    '''
    Clean the dataset by removing problematic string combinations and update timestamp to ISO format
    '''
    infile = "2023.csv"
    fixed_filename = "2023-fixed.csv"
    clean_filename = "2023-clean.csv"

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
            f"copy (select * from requests) to '{clean_filename}' with (HEADER True, DELIMITER ',');")

    except FileNotFoundError:
        print(f"File {infile} not found.")


def hfUpload():
    '''
    Upload the clean dataset to huggingface.co
    '''
    local_filename = '2023-clean.csv'
    dest_filename = '2023.csv'
    username = 'edwinjue'
    repo_name = '311-data-2023'
    repo_type = 'dataset'

    repo_id = f"{username}/{repo_name}"
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
    for file in glob.glob("*.csv"):
        os.remove(file)


def main():
    dlData()
    hfClean()
    hfUpload()
    cleanUp()


main()
