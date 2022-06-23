# -*- coding: utf-8 -*-
"""
Created on Sat Jun  4 17:49:23 2022

@author: AdithiPriya

"""
# import the necessary packages...

import pandas as pd
import requests

data_2021= []
skip=0   # this denotes the page number 
limit= 10000
# since there are no next_url option or information about the total number of records, we will create a while loop...
while True:
    url=f'https://dev-api.311-data.org/requests?start_date=2021-01-01&end_date=2021-12-31&skip={skip}&limit={limit}'
    #print('Requesting', url)
    response= requests.get(url)
    data= response.json()
    # Are there any more page left??? 
    if data==[]: # if not, exit the loop...
        break
    # If there are pages left, add them to the variable data_2021 and move on to the next loop...
    data_2021.extend(data)
    skip=skip+limit
data_2021_df = pd.DataFrame(data_2021)  

data_2021_df=data_2021_df.sort_values(by='createdDate')    # sorting the data frame by created date...

data_2021_df=data_2021_df.reset_index(drop=True)         # reindexing...

data_2021_df.to_csv('clean_311_data_2021.csv')   # saving the dataframe as a csv file...

