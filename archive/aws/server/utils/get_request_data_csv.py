import argparse
import requests
import pandas as pd

REQUESTS_BATCH_SIZE = 10000


def get_311_request_data(start_date, end_date):
    """Fetches 311 requests from the 311 data server. 

    Retreives 311 requests from the 311 data server for a given start_date and end_date.

    Args:
        start_date: The date from which the 311 request data have to be collected. Datatype: Datetime. 
        end_date: The date upto which the 311 request data have to be fetched. Datatype: Datetime.  

    Return:    
        Dataframe data_final is returned with 15 columns. The dataframe is saved as a CSV file ('data_final.csv') in the current directory.
    """

    skip = 0
    all_requests = []
    while True:
        url = f'https://dev-api.311-data.org/requests?start_date={start_date}&end_date={end_date}&skip={skip}&limit={REQUESTS_BATCH_SIZE}'
        response = requests.get(url)
        data = response.json()
        all_requests.extend(data)
        skip += REQUESTS_BATCH_SIZE
        if len(data) < REQUESTS_BATCH_SIZE:
            break
    data_final = pd.DataFrame(all_requests)
    data_final.sort_values(by='createdDate', inplace=True, ignore_index=True)
    return data_final


def main():
    """Prints out the preview of the dataframe data_final in the command line. 
    The result is written to a csv file and saved in the current working directory of the user.
    """

    parser = argparse.ArgumentParser(
        description='Gets 311 request data from the server')
    parser.add_argument('start_date', type=str,
                        help='The start date that has to be entered')
    parser.add_argument('end_date', type=str,
                        help='The end data that has to be entered')
    args = parser.parse_args()
    start_date = args.start_date
    end_date = args.end_date
    data_final = get_311_request_data(start_date, end_date)
    data_final.to_csv('data_final.csv')
    print(data_final)


if __name__ == "__main__":
    main()
