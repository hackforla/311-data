import pandas as pd
import requests
import argparse

def get_311_request_data(start_date, end_date):
    skip = 0
    limit = 10000
    all_requests = []
    while True:
        url=f'https://dev-api.311-data.org/requests?start_date={start_date}&end_date={end_date}&skip={skip}&limit={limit}'
        response = requests.get(url)
        data = response.json()
        if data == []:
            break   
        all_requests.extend(data)
        skip += limit
        data_final = pd.DataFrame(all_requests) 
        data_final.sort_values(by='createdDate', inplace = True, ignore_index = True)
    data_final.to_csv('data_final.csv')
    return data_final

def main():
    parser = argparse.ArgumentParser(description='Gets 311 request data from the server')
    parser.add_argument('start_date', type=str,  help='The start date that has to be entered')
    parser.add_argument('end_date', type=str, help='The end data that has to be entered')
    args = parser.parse_args()
    start_date = args.start_date
    end_date = args.end_date
    data_final = get_311_request_data(start_date, end_date) 
    print(data_final)   
    
if __name__  == "__main__":
    main()
    
    
    
    
                     
