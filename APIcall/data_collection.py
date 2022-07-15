import pandas as pd
import requests
from datetime import date

def api_311(start_date, end_date, skip, limit):
    skip=0
    limit=10000
    data_year= []
    while True:
        url=f'https://dev-api.311-data.org/requests?start_date={start_date}&end_date={end_date}&skip={skip}&limit={limit}'
        print('Requesting url:', url)
        response=requests.get(url)
        data=response.json()
        if data==[]:
            break   
        data_year.extend(data)
        skip=skip+limit
    return data_year
