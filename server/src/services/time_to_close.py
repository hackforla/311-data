from configparser import ConfigParser
import sqlalchemy as db
import pandas as pd
import json


class time_to_close(object):
    def __init__(self,
                 config=None,
                 tableName="ingest_staging_table"):
        """
        Choose table from database by setting the value of tableName.
        Default table is the staging table.
        """
        self.config = config
        self.dbString = None if not self.config\
            else self.config['Database']['DB_CONNECTION_STRING']
        self.table = tableName
        self.data = None

    def ttc_view_dates(self, service=False):
        """
        Returns all rows under the CreatedDate and
            ClosedDate columns in human-readable format
        Returns all rows with a service date under
            CreatedDate, ClosedDate, and ServicedDate columns
            if serviced is True
        """
        engine = db.create_engine(self.dbString)

        if service:
            df = pd.read_sql_query(
                "SELECT \
                createddate,\
                closeddate,\
                servicedate\
                FROM %s" % self.table, con=engine)
            df = df[df['servicedate'].notnull()]
        else:
            df = pd.read_sql_query(
                "SELECT \
                createddate,\
                closeddate\
                FROM %s" % self.table, con=engine)

        df['createddate'] = df['createddate'].apply(
            lambda x: x.strftime('%m/%d/%Y %I:%M:%S %p'))

        return df.to_json(orient='index')

    def ttc_to_days(self, dt):
        """
        Converts Unix time to days
        """
        num_days = pd.Timedelta.total_seconds(dt)/(24.*3600)
        if num_days <= .000001:
            return 0

        in_days = pd.Timedelta.total_seconds(dt)/(24.*3600)
        return in_days

    def ttc_time_diff(self, alldata, service, allRequests, requestType):
        """
        Sets self.data to a dataframe catalogging the time
            it takes a request to close
        Parameters are inherited from ttc_summary()
        """

        engine = db.create_engine(self.dbString)

        if service:
            if not allRequests:
                query = "SELECT \
                        createddate,\
                        closeddate,\
                        servicedate\
                        FROM %s WHERE requesttype=%s" %\
                        (self.table, requestType)
                print(query)
                df = pd.read_sql_query(
                    query, con=engine)
            else:
                df = pd.read_sql_query(
                    "SELECT \
                    createddate,\
                    closeddate,\
                    servicedate\
                    FROM %s" %
                    self.table, con=engine)
            df = df[df['servicedate'].notnull()]
            df['servicedate'] = pd.to_datetime(df['servicedate'])
            diff_df = pd.DataFrame(
                df['servicedate'] - df['createddate'],
                columns=['time_to_service'])

        else:
            if not allRequests:
                df = pd.read_sql_query(
                    "SELECT \
                    createddate,\
                    closeddate\
                    FROM %s WHERE requesttype=%s" %
                    (self.table, requestType), con=engine)
            else:
                df = pd.read_sql_query(
                    "SELECT \
                    createddate,\
                    closeddate\
                    FROM %s" %
                    self.table, con=engine)
            diff_df = pd.DataFrame({'time_to_close': []})

        df['createddate'] = pd.to_datetime(df['createddate'])
        df['closeddate'] = pd.to_datetime(df['closeddate'])
        diff_df['time_to_close'] = df['closeddate'] - df['createddate']
        diff_df = diff_df[diff_df['time_to_close'].notnull()]

        for column in diff_df:
            diff_df[column] = diff_df[column].apply(self.ttc_to_days)

        self.data = diff_df

    def ttc_summary(self,
                    allData=False,
                    service=False,
                    allRequests=True,
                    requestType="",
                    viewDates=False):
        """
        Returns summary data of the amount of time it takes for a
            request to close as a dataframe.
        If service is set to True, returns summary data of time_to_service as well
        If allData is set to True, returns the data of every entry as well
        If allRequests are set to False, queries data of
        the value of requestType only
        """
        self.ttc_time_diff(allData, service, allRequests, requestType)
        data = self.data
        print(data)

        summary_arr = []

        for column in data:
            summary = data[column].describe()
            df_desc = pd.DataFrame({column: summary})
            df_json = json.loads(df_desc.to_json())
            summary_arr.append(df_json)

        if not allData and not viewDates:
            return summary_arr

        data_arr = []
        data_arr.append(summary_arr)

        if allData:
            days_df = data.copy()
            days_df_json = json.loads(days_df.to_json())
            data_arr.append(days_df_json)

        if viewDates:
            dates = self.ttc_view_dates(service)
            data_arr.append(json.loads(dates))

        return data_arr

    # Todo: Implement functionality for only open status data?
    # Todo: Implement option to filter by NC?


if __name__ == "__main__":
    ttc = time_to_close()
    config = ConfigParser()
    config.read("../setting.cfg")
    ttc.config = config
    ttc.dbString = config['Database']['DB_CONNECTION_STRING']
    ttc.ttc_summary()
