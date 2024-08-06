import requests
import os
from tqdm import tqdm
import duckdb

def dlData():
    '''
    Download the dataset from data.lacity.org
    '''
    url = "https://data.lacity.org/api/views/b7dx-7gc3/rows.csv?accessType=DOWNLOAD"
    outfile = "2024.csv"

    response = requests.get(url, stream=True)

    # Save downloaded file
    with open(outfile, "wb") as file:
        for data in tqdm(response.iter_content()):
            file.write(data)

def hfClean():
    '''
    Clean the dataset by removing problematic string combinations and update timestamp to ISO format
    '''
    infile = "2024.csv"
    fixed_filename = "2024-fixed.csv"
    clean_filename = "2024-clean.parquet"

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

def main():
    dlData()
    hfClean()

if __name__ == "__main__":
    main()
