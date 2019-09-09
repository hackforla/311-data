#!/usr/bin/env python
# coding: utf-8

# In[15]:


import pandas as pd
import numpy as np
import geopandas as gpd
from bokeh.plotting import figure, show, output_file, save
from bokeh.layouts import column, row, WidgetBox
from bokeh.models import ColumnDataSource, LinearColorMapper, Select, RadioButtonGroup
from bokeh.palettes import brewer
from bokeh.io import output_notebook, push_notebook

from bokeh.application.handlers import FunctionHandler
from bokeh.application import Application

output_notebook()


# In[2]:


nc_map = gpd.read_file('https://data.lacity.org/api/geospatial/fu65-dz2f?method=export&format=GeoJSON')


# In[3]:


df_311 = pd.read_csv('https://data.lacity.org/api/views/pvft-t768/rows.csv?accessType=DOWNLbOAD')
df_311['CreatedDate1']=pd.to_datetime(df_311['CreatedDate']) 


# In[8]:


df_311_2018 = pd.read_csv('https://data.lacity.org/api/views/h65r-yf5i/rows.csv?accessType=DOWNLOAD')
df_311_2018['CreatedDate1'] = pd.to_datetime(df_311_2018['CreatedDate'])


# In[33]:


def modify_doc(doc):
    
    def trimmer(dataframe):
        dataframe['NCName'] = dataframe['NCName'].astype(str)
        return dataframe[['Latitude','Longitude','NCName','CreatedDate1','RequestType']]
    
    def month_convert(dataframe):
        dataframe['Month'] = dataframe['CreatedDate1'].dt.month
        return dataframe
    
    def monthly_call_volume(dataframe, month):
        new_df = dataframe.loc[(dataframe['Month'] == month)].groupby('NCName').agg('count')
        new_df = new_df.reset_index()
    
        new_df.rename({'NCName':'name','CreatedDate1':'Calls'},axis=1,inplace=True)
        new_df.drop(['Latitude','Longitude','Month','RequestType'],axis=1,inplace=True)
    
        return new_df
    
    def geomerger(geo_file, dataframe):
        fusion = geo_file.merge(dataframe,on='name')
        return fusion
    
    def column_data_source_maker(geo_data_frame):
        def getPolyCoords(row, geom, coord_type):
            exterior = row[geom][0].exterior
            if coord_type == 'x':
                return list( exterior.coords.xy[0] )
            elif coord_type == 'y':
                return list( exterior.coords.xy[1] )
    
        geo_data_frame['x'] = geo_data_frame.apply(getPolyCoords, geom='geometry', coord_type='x', axis=1)
        geo_data_frame['y'] = geo_data_frame.apply(getPolyCoords, geom='geometry', coord_type='y', axis=1)
    
        geo_data_frame.drop('geometry',axis=1,inplace=True)
        new_column_source = ColumnDataSource(geo_data_frame)
        return new_column_source
    
    def update(attr,old,new):
        if radio_button.active == 1:
            new = monthly_call_volume(month_convert(trimmer(df_311)),month_to_num[select.value])
            new_geo = geomerger(nc_map,new)
            newly = column_data_source_maker(new_geo)
            nsource.data.update(newly.data)
        else:
            new = monthly_call_volume(month_convert(trimmer(df_311_2018)),month_to_num[select.value])
            new_geo = geomerger(nc_map,new)
            newly = column_data_source_maker(new_geo)
            nsource.data.update(newly.data)
        push_notebook()
    
    TOOLTIPS = [('Neighborhood Council Name','@name'),('Call Volume','@Calls')]
    p1 = figure(title="Monthly 2018 & 2019 311 Call Volume by Neighborhood Council",tools='hover, pan, tap, wheel_zoom',
                tooltips=TOOLTIPS)
    
    palette = brewer['YlGnBu'][8]
    palette = palette[::-1]
    
    color_mapper = LinearColorMapper(palette = palette, low = 0, high = 3000)
    
    nsource = column_data_source_maker(geomerger(nc_map,monthly_call_volume(month_convert(trimmer(df_311)),5)))
    p1.patches('x', 'y', source=nsource,fill_color = {'field' :'Calls', 'transform' : color_mapper},
        line_color="black", line_width=0.05)
    
    radio_button = RadioButtonGroup(labels=['2018','2019'], active=1)
    radio_button.on_click(update)
    
    select = Select(title="Month", value='May',options=['January',"February","March","April","May","June",
                                                        "July","August","September"])
    month_to_num = {'January': 1,'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6, 'July' : 7, 'August' : 8, 
               'September': 9, 'October': 10, 'November': 11, 'December': 12}
    select.on_change('value',update)
    
    controls = WidgetBox(radio_button,select)
    layout = row(controls,p1)
    doc.add_root(layout)


# In[34]:


handler = FunctionHandler(modify_doc)
app = Application(handler)


# In[35]:


show(app)


# In[ ]:




