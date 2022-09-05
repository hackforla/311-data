# **API call to fetch 311 request data from the 311 data server for a given start date and end date.** 

### The 311 request data from the [lacity.org](https://data.lacity.org/browse?q=MyLA311%20Service%20Request%20Data%20&sortBy=relevance) has 34 columns. The get_request_data_csv.py script can be run from the command line passing the arguments- start_date and end_date that lets you retreive the 311 request data from the [311 data server](https://dev-api.311-data.org/docs). The 311 server processes the data from the lacity.org. The data cleaning procedure is mentioned [here](https://github.com/hackforla/311-data/blob/dev/docs/data_loading.md). The dataframe that is returned can be saved as a csv file. A preview of the data_final dataframe is printed in the command line. 

### Example: python get_311_request_data_csv.py "2021-01-01" "2021-01-03" will return 261 rows and 15 columns.

![image](https://user-images.githubusercontent.com/10836669/188473763-52bc9474-0878-432c-b4e8-6e4ff21dcda2.png)
