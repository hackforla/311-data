import pandas as pd
import numpy as np
from datetime import datetime

class RegionPipeline(object):
    """
    Class for creating csv file datasets for 
    each region in LA. 
    """

    def __init__(self):
        """
        Constructor for Region Class
        """
        self.arrests = pd.DataFrame() #Arrests
        self.vehped = pd.DataFrame()  #Vehicle and Pedestrian Stops
        self.crimes = pd.DataFrame()  #Crimes
        self.ctypes = pd.Series()     #Crime types
        self.sr = pd.DataFrame()      #Service Requests
        self.srt = pd.DataFrame()     #Service Request Types
    
    def convert(self, string):
        """
        Converts date and time string to datetime object. 
        """
        date = datetime.strptime(string[:10],'%m/%d/%Y')   
        
        return date
    
    def filterdates(self, df):
        """
        Helper function for filtering dates to only include dates
        between 2017 and 2019. 
        """
        
        start_date = datetime.strptime('1/1/2017','%m/%d/%Y') 
        end_date = datetime.strptime('12/31/2019','%m/%d/%Y')  
        df = df[(df['Converted Dates'] >= start_date) & (df['Converted Dates'] <= end_date)]

        return df

    def resetidx(self, s):
        """
        Helper function for reindexing data frame to 
        include dates where relevant count is 0. 
        """
        
        start_date = datetime.strptime('1/1/2017','%m/%d/%Y') 
        end_date = datetime.strptime('12/31/2019','%m/%d/%Y')

        idx = pd.date_range(start_date, end_date)
        s = s.reindex(idx, fill_value = 0)

        return s

    def regarrests(self, csv, regionid):
        """
        Returns dataframe which displays the total number of arrests in inputted region  
        per day, every day since January 1st, 2017 until December 31, 2019.  
        Data: https://data.lacity.org/A-Safe-City/Arrest-Data-from-2010-to-Present/yru6-6re4/data
        """

        #Read csv file and create dataframe
        df = pd.read_csv(csv)  
        
        #Filter dataframe by region. 
        df = df[df['Area ID'] == regionid] 
        
        #Use helper function to filter dates
        df['Converted Dates'] = df['Arrest Date'].apply(self.convert, 0)
        df = self.filterdates(df) 

        #Creates dataframe with dates and arrest counts per date    
        unique_elements, counts_elements = np.unique(df['Converted Dates'], return_counts = True) 
        s = pd.Series(counts_elements)
        s.index = unique_elements
        datecounts = pd.DataFrame({'Date': self.resetidx(s).index, 'Arrests': self.resetidx(s).values})
        
        return datecounts
    
    def regvehstops(self, csv, region):
        """ 
        Reads csv file and returns dataframe which displays total number of
        vehicle stops in specified region for every day between January 1st, 2017 and December 31, 2019. 
        """

        #Read csv file and create dataframe filtered by region
        df = pd.read_csv(csv)
        df = df[(df['Division Description 1'] == region) & (df['Stop Type'] == 'VEH')] 

        #Use helper function to filter dates
        df['Converted Dates'] = df['Stop Date'].apply(self.convert, 0)
        df = self.filterdates(df)  
        
        #Creates dataframe with dates and vehicle stop counts per date 
        unique_elements, count_elements = np.unique(df['Converted Dates'], return_counts = True)
        s = pd.Series(count_elements)
        s.index = unique_elements
        datecounts = pd.DataFrame({'Date':self.resetidx(s).index, 'Number of Vehicle Stops':self.resetidx(s).values})
        
        return datecounts
    
    def regpedstops(self, csv, region):
        """ 
        Reads csv file and returns dataframe which displays total number of
        pedestrian stops in Hollywood for every day between January 1st, 2017 and December 31, 2019. 
        """

        #Read csv file and create dataframe filtered by region
        df = pd.read_csv(csv)
        df = df[(df['Division Description 1'] == region) & (df['Stop Type'] == 'PED')] 
        
        #Use helper function to filter dates
        df['Converted Dates'] = df['Stop Date'].apply(self.convert, 0)
        df = self.filterdates(df)   

        #Creates dataframe with dates and pedestrian stop counts per date 
        unique_elements, count_elements = np.unique(df['Converted Dates'], return_counts = True)
        s = pd.Series(count_elements)
        s.index = unique_elements 
        datecounts = pd.DataFrame({'Date':self.resetidx(s).index, 'Number of Pedestrian Stops':self.resetidx(s).values})
        
        return datecounts

    def combinevp(self, csv, region):
        """
        Creates combined dataframe for vehicle and pedestrian counts
        in specified region.
        Data: https://data.lacity.org/A-Safe-City/Vehicle-and-Pedestrian-Stop-Data-2010-to-Present/ci25-wgt7/data
        """

        peddf = self.regpedstops(csv, region) 
        vehdf = self.regvehstops(csv, region)
        peddf['Number of Vehicle Stops'] = vehdf['Number of Vehicle Stops'] 
        
        return peddf 
    
    def regcrimes(self, csv, regionid):
        """ 
        Reads csv file and returns dataframe which displays total number of
        crimes committed in specified region for every day between January 1st, 2017 and December 31, 2019. 
        Data: https://data.lacity.org/A-Safe-City/Crime-Data-from-2010-to-2019/63jg-8b9z/data
        """
        
        #Read csv file and create dataframe filtered by specified region
        df = pd.read_csv(csv)
        df = df[df['AREA '] == regionid]  
        
        #Use helper function to filter dates
        df['Converted Dates'] = df['DATE OCC'].apply(self.convert, 0)
        df = self.filterdates(df)   
        
        #Creates dataframe with dates and crimes counts per date 
        unique_elements, count_elements = np.unique(df['Converted Dates'], return_counts = True)
        s = pd.Series(count_elements)
        s.index = unique_elements 
        datecounts = pd.DataFrame({'Date':self.resetidx(s).index, 'Number of Crimes Committed':self.resetidx(s).values})
        
        return datecounts

    def ctypeshelper(self, date, df, types):
        """ 
        Helper function for ctypes. Returns dictionary displaying the 
        number of times each of the 141 crimes were committed on 
        the specified date
        """

        t = df[df['Converted Dates'] == date]['Crm Cd Desc']
        unique_elements, count_elements = np.unique(t, return_counts = True)
        s = pd.Series(count_elements)
        s.index = unique_elements
        s = s.reindex(types, fill_value = 0)
        
        return s.to_dict()

    def crimetypes(self, csv, regionid):
        """
        Returns series containing a dictionary for each date 
        between 2017 and 2019. The dictionary contains the number of times 
        each of the 141 unique crimes were commmited for that day in the 
        specified region. 
        """
        
        #Read csv file 
        df = pd.read_csv(csv)

        #Create array of 141 unique crime types to use in helper function
        types = (np.unique(df['Crm Cd Desc']))
        
        #Use helper function to filter dates 
        df['Converted Dates'] = df['DATE OCC'].apply(self.convert, 0)
        df = self.filterdates(df)  
        
        #Creates series with dates between 2017 and 2019 as index
        s = pd.Series(np.unique(df['Converted Dates']))
        s.index = s
        
        #Filters dataframe by region
        df = df[df['AREA '] == regionid]
            
        #Apply helper function to all dates in s
        s = s.apply(self.ctypeshelper, args = (df,types, ))

        return s
    
    def srdf(self, csv2017, csv2018, csv2019): 
        """
        Creates service request dataframe for all service requests in LA
        between 2017 and 2019
        """
        df = pd.concat(map(pd.read_csv, [csv2017, csv2018, csv2019]), ignore_index = True)
        df['PolicePrecinct'] = df['PolicePrecinct'].replace({'WEST LOS ANGELES': 'WEST LA',
                                                             'NORTHEAST': 'NORTH EAST',
                                                             'SOUTHEAST': 'SOUTH EAST',
                                                             'SOUTHWEST': 'SOUTH WEST',
                                                             '77TH STREET': 'SEVENTY-SEVENTH'})
        return df
    
    def totalsr(self, df, region):
        """ 
        Accepts dataframe and returns dataframe which displays total number of service requests
        per date in specified region for every day between 2017 and 2019. 
        """

        #Filter dataframe by region
        df = df[df['PolicePrecinct'] == region] 
        df['Converted Dates'] = df['CreatedDate'].apply(self.convert, 0) 

        #Creates dataframe with dates and number of service request per date  
        unique_elements, count_elements = np.unique(df['Converted Dates'], return_counts = True)
        s = pd.Series(count_elements)
        s.index = unique_elements    
        datecounts = pd.DataFrame({'Date':self.resetidx(s).index, 'Service Requests':self.resetidx(s).values})
        
        return datecounts
    
    def srthelper(self, df, date, cols):
        """ 
        Helper function for stypes. 
        """

        t = df[df['Converted Dates'] == date]['RequestType']
        unique_elements, counts_elements = np.unique(t, return_counts = True)
        s = pd.Series(counts_elements)
        s.index = unique_elements
        s = s.reindex(cols, fill_value = 0)
        
        return s.values
        
    def srtypes(self, df, region):
        """
        Returns dataframe which displays number of times each of the 
        12 service request types were request per day in specified region, for 
        every day between 2017 and 2019. 
        """
        
        #adds Converted Dates column to dataframe
        df['Converted Dates'] = df['CreatedDate'].apply(self.convert, 0)
        
        #Create empty datecounts dataframe
        dates = np.unique(df['Converted Dates'])
        cols = np.unique(df['RequestType'])

        numdate = 1095 #Number of dates between 2017 and 2019
        src = 12 #number of service request categories

        datecounts = pd.DataFrame(pd.np.empty((numdate, src))).set_index(dates)
        datecounts.columns = cols
        
        #Filters dataframe by region
        df = df[df['PolicePrecinct'] == region]
        
        #Apply helper function to all dates and add results to datecounts
        for index, row in datecounts.iterrows():
            datecounts.loc[index] = self.srthelper(df, index, cols)
        
        return datecounts
    
    def create(self, arrestcsv, vehpedcsv, crimecsv, csv2017, csv2018, csv2019, regionid, region):
        """
        Combines all data into one dataframe. 
        """

        self.arrests = self.regarrests(arrestcsv, regionid)
        self.vehped = self.combinevp(vehpedcsv, region)
        self.crimes = self.regcrimes(crimecsv, regionid)
        self.ctypes = self.crimetypes(crimecsv, regionid)
        self.sr = self.totalsr(self.srdf(csv2017, csv2018, csv2019), region)
        self.srt = self.srtypes(self.srdf(csv2017, csv2018, csv2019), region)

        finaldf = self.arrests

        finaldf['Vehicle Stops'] = self.vehped['Number of Vehicle Stops']
        finaldf['Pedestrian Stops'] = self.vehped['Number of Pedestrian Stops']
        finaldf['Crimes Committed'] = self.crimes['Number of Crimes Committed']
        finaldf['Crime Types'] = self.ctypes.values
        finaldf['Service Requests'] = self.sr['Service Requests']
        finaldf = pd.concat([finaldf.reset_index(drop=True),self.srt.reset_index(drop = True)], axis=1)

        return finaldf.to_csv(region + '.csv', index = False)


REG = RegionPipeline()
REG.create(arrestcsv, vehpedcsv, crimecsv, csv2017, csv2018, csv2019, regionid, region)
#Regionid and Regions
"""
1, 'CENTRAL'  
2, 'RAMPART' 
3, 'SOUTH WEST'
4, 'HOLLENBECK'
5, 'HARBOR'
6, 'HOLLYWOOD'
7, 'WILSHIRE'
8, 'WEST LA'
9, 'VAN NUYS' 
10, 'WEST VALLEY'
11, 'NORTH EAST'
12, 'SEVENTY-SEVENTH'
13, 'NEWTON'
14, 'PACIFIC'
15, 'NORTH HOLLYWOOD'
16, 'FOOTHILL'
17, 'DEVONSHIRE'
18, 'SOUTH EAST'
19, 'MISSION'
20, 'OLYMPIC'
21, 'TOPANGA'
"""