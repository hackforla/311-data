# import the necessary packages...

import pandas as pd
import requests

data_2021= []
skip=0   # This denotes the page number. 
limit= 10000
# Since there are no next_url option or information about the total number of records, we will create a while loop.
while True:
    url=f'https://dev-api.311-data.org/requests?start_date={start_date}&end_date={end_date}&skip={skip}&limit={limit}'
    response= requests.get(url)
    data= response.json()
    # Are there any more page left? 
    if data==[]: # if not, exit the loop...
        break
    # If there are pages left, add them to the variable data_2021 and move on to the next loop.
    data_2021.extend(data)
    skip=skip+limit
data_2021_df = pd.DataFrame(data_2021)  

data_2021_df=data_2021_df.sort_values(by='createdDate')    # Sorting the data frame by created date.

data_2021_df=data_2021_df.reset_index(drop=True)         # Reindexing the dataframe.

data_2021_df.to_csv('clean_311_data_2021.csv')   # Saving the dataframe as a csv file.

