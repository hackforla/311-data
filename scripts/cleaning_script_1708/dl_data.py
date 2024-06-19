import requests
import os
from tqdm import tqdm

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

def main():
    dlData()

if __name__ == "__main__":
    main()
