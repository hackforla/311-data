import pandas as pd
import requests
import argparse
from datetime import date

def api_311(start_date, end_date, skip, limit):
    skip = 0
    limit = 10000
    data_year = []
    while True:
        url=f'https://dev-api.311-data.org/requests?start_date={start_date}&end_date={end_date}&skip={skip}&limit={limit}'
        response = requests.get(url)
        data = response.json()
        if data == []:
            break   
        data_year.extend(data)
        skip = skip + limit
        data_final = pd.DataFrame(data_year) 
        data_final.sort_values(by='createdDate', inplace = True, ignore_index = True)
        data_final.to_csv('data_final.csv')
    return data_final

def main():
    parser = argparse.ArgumentParser(description = 'API call to fetch 311 data from the pipeline')
    parser.add_argument('start_date', type = str,  help = 'This is the start date that has to be entered')
    parser.add_argument('end_date', type = str, help = 'This is the end data that has to be entered')
    parser.add_argument('skip', type= int, help = 'This gives you the page number of the API search')
    parser.add_argument('limit', type = int,  help = 'This gives you the number of records that will be fetched for each page')
    args = parser.parse_args()
    start_date = args.start_date
    end_date = args.end_date
    data_final = api_311(start_date, end_date,  args.skip, args.limit) 
    print(data_final)
    
if __name__  == "__main__":
    main()
    
    
    
    
                     
