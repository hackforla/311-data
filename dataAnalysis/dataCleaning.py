import pandas as pd

'''
Data pipeline for ingestion of 311-data datasets
General sections: 
1. ACQUIRE: Download data from source
2. CLEAN:   Perform data cleaning and organization before entering into SQL
3. INGEST:  Add data set to SQL database

These workflows can be abstracted/encapsulated in order to better generalize
across tasks if necessary.
'''

### 1. ACQUIRE ###
# Code for automated data download goes here


### 2. CLEAN ###

# Load data file from TSV/CSV
### xNOTE: Can encapsulate this workflow and reapply for each data set
dfb = pd.read_table('311data2019.tsv',sep='\t') # For now assume data in this folder

# Format dates as datetime (Time intensive)
dfb['CreatedDate'] = pd.to_datetime(dfb['CreatedDate'])
dfb['ClosedDate'] = pd.to_datetime(dfb['ClosedDate'])
dfb['ServiceDate'] = pd.to_datetime(dfb['ServiceDate'])

# Compute service time
# New columns: closed_created, service_created
dfb['closed_created'] = dfb.ClosedDate-dfb.CreatedDate
dfb['service_created'] = dfb.ServiceDate-dfb.CreatedDate

# drop NA values and reformat closed_created in units of hours
dfb = dfb[~dfb.closed_created.isna()]

# New column: closed_created in units of days 
dfb['closed_createdD'] = dfb.closed_created / pd.Timedelta(days=1)

# xFUTURE: Geolocation/time clustering to weed out repeat requests
# xFUTURE: Decide whether ServiceDate or ClosedDate are primary metric
# xFUTURE: Removal of feedback and other categories

# Save output file 
# xFUTURE: May not be necessary after SQL database established
dfb.to_pickle('311data-cleaned.gzip')

# xNote: To open: pd.read_pickle('311data-cleaned.gzip')

### 3. INGEST ###
# Code for addition to SQL database goes here

