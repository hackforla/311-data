import datetime
import dash_daq as daq
import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import requests as re

from config import API_HOST
from design import  DISCRETE_COLORS, LABELS, apply_figure_style
from dash import dcc, html, callback
from dash.dependencies import Input, Output
from dash.exceptions import PreventUpdate

# Setting 1 week worth of data
start_date = datetime.date.today() - datetime.timedelta(days=300)
end_date = datetime.date.today() - datetime.timedelta(days=200)
 
df_path = f"/requests/updated?start_date={start_date}&end_date={end_date}"
results = re.get(API_HOST + df_path)
data_json = results.json()
data_2020 = pd.json_normalize(data_json)


layout = html.Div([

    html.Div(children=[

        ## Neighborhood Council Dashboard
        html.Div(children=[
            html.H2("LA 311 Requests - Neighborhood Council Summary Dashboard", style={'vertical-align':'middle'} ),
            html.Div([daq.ToggleSwitch(id='dataQualitySwitch', value=True, style={'height':'vh'}, size = 35),
            html.Div(id='dataQualityOutput')], style={'font-family':'Open Sans'})
        ], style={'display':'flex', "justify-content": "space-between", 'vertical-align':'middle' , 'height':'5vh', 'width':'97.5vw'}),
    
        ## Summary Dropdown
        html.Div(children=[
            html.Div(dcc.Dropdown(sorted([n for n in set(data_2020['councilName'])]), ' ', id='nc_dropdown', placeholder="Select a Neighborhood Council..."), style={'display': 'inline-block', 'width':'48.5vw'}),
            html.Div(dcc.Dropdown(id='nc_dropdown_filter', multi=True, placeholder="Select a Request Type..."), style={'display': 'inline-block', 'width':'48.5vw'})
        ], style={'display':'flex' ,  "justify-content": "space-between", "width": "97.5vw", "height": "10vh"}),

        html.Div(html.Br(), style={"height":"0.5vh"}),

        # Line Chart for Number of Request throughout the day
        html.Div(dcc.Graph(id='ncAvgCompLineChart', style={"height":"40vh", 'width':'97.4vw'}), style={"border":"0.5px black solid", "height":"40vh", 'width':'97.4vw'}),
       
        html.Div(html.Br(), style={"height":"1vh"}),
       
        html.Div(children=[
            html.Div(
                # Pie Chart for the share of request type
                dcc.Graph(
                    id="reqTypePieChart", style={"height":"40vh", 'width':'48.5vw'}
                    ), style={'display': 'inline-block', 'width':'48.5vw', "border":"0.5px black solid", "height":"40vh"}), # for border-radius , add stuff later
            html.Div(
                # Histogram for the request timeToClose
                dcc.Graph( 
                    id="timeCloseHist", style={"height":"40vh", 'width':'48vw'}
                    ), style={'display': 'inline-block', 'width':'48vw', "border":"0.5px black solid", "height":"40vh"})
        ], style={'display':'flex', "justify-content": "space-between", "width":'97.5vw'})
        
    ]),

    html.Div(html.Br(), style={"height":"vh"}),
   
    # Neighborhood Council Summarization Dashboard
    html.Div(children=[
        html.H2("LA 311 Requests - Neighborhood Council Comparison Dashboard")
    ], style={'textAlign':'center', 'height':'5vh'}),

    ## Comparison Dropdowns
    html.Div(children=[
        html.Div(dcc.Dropdown(sorted([n for n in set(data_2020['councilName'])]), ' ', id='nc_comp_dropdown', placeholder="Select a Neighborhood Council..."), style={'display': 'inline-block', 'width':'48.5vw'}),
        html.Div(dcc.Dropdown(sorted([n for n in set(data_2020['councilName'])]), ' ', id='nc_comp_dropdown2', placeholder="Select a Neighborhood Council..."), style={'display': 'inline-block', 'width':'48.5vw'}),
    ], style={'display':'flex' ,  "justify-content": "space-between", "width": "97.5vw", "height": "12vh"}),

        
    html.Div(html.Br(), style={"height":"1vh"}),

    ## NC Comparison - Indicator Visuals
    html.Div(children = [
        html.Div(children = [
        

        # Indicator Visuals for Total number of requests and the number of days the data spans across
            html.Div([
                html.H6("Total Number of Requests", style={"text-align":'center'}), 
                html.H1(id='totalReqCard', style={"text-align":'center'})],  
                style={'display': 'inline-block', 'width':'24vw', 'height':'16vh', "border":"0.5px black solid"}),
            html.Div([
                html.H6("Number of Days", style={"text-align":'center'}), 
                html.H1(id='numDaysCard', style={"text-align":'center'})],  
                style={'display': 'inline-block', 'width':'24vw', 'height':'16vh', "border":"0.5px black solid"})
            
        
        ], style={'display':'flex' ,  "justify-content": "space-between", 'width':'48.5vw'}),
        
        
        # Indicator Visuals for Total number of requests and the number of days the data spans across
        html.Div(children=[ 
            html.Div([
                html.H6("Total Number of Requests", style={"text-align":'center'}), 
                html.H1(id='totalReqCard2', style={"text-align":'center'})],  
                style={'display': 'inline-block', 'width':'24vw', 'height':'16vh', "border":"0.5px black solid"}),
            html.Div([
                html.H6("Number of Days", style={"text-align":'center'}), 
                html.H1(id='numDaysCard2', style={"text-align":'center'})],  
                style={'display': 'inline-block', 'width':'24vw', 'height':'16vh', "border":"0.5px black solid"}) 
            
        
        ], style={'display':'flex' ,  "justify-content": "space-between", 'width':'48.5vw'})
    ] , style={'display':'flex' ,  "justify-content": "space-between", "width": "97.5vw"}),

        
    html.Div(html.Br(), style={"height":"1vh"}),

    ## NC Comparison -  Request Source Bar Charts
    html.Div(children = [
        html.Div(dcc.Graph(id='reqSourceBarChart', style={"height":"30vh"}), style={'display': 'inline-block', 'width':'48.5vw', "border":"0.5px black solid",  "height":"30vh"}),
        html.Div(dcc.Graph(id='reqSourceBarChart2', style={"height":"30vh"}), style={'display': 'inline-block', 'width':'48.5vw', "border":"0.5px black solid", "margin-left": "10px",   "height":"30vh"})
    ] , style={'display':'flex' ,  "justify-content": "space-between", "width": "97.5vw"}),
    
    html.Div(html.Br(), style={"height":"1vh"}),
    
    ## NC Comparison - Number of Requests per day Overlapping line chart
    html.Div(dcc.Graph(id='overlayReqTimeLineChart', style={"height":"32vh", "width":"97.5vw"}), style={"border":"0.5px black solid", "height":"32vh", "width":"97.5vw"})
])



# Callback Function to generate Dynamic Filter Selection -
# Removing request types that doesn't exist in NC
@callback(
    [Output('nc_dropdown_filter', 'options'),
     Output('nc_dropdown_filter', 'value')],
     Input('nc_dropdown', 'value')

)
def generate_dynamic_filter(nc_dropdown):
    if not nc_dropdown:
        df = data_2020
    else:
        df = data_2020[data_2020['councilName'] == nc_dropdown]
    
    rTypes = sorted([n for n in set(df['typeName'])])
    return rTypes, ' '


## Generate the charts and filters for NC Summary Dashboard, including:
## Share of Request Type Pie Chart, Distribution of request timeToClose, 
## Number of Request throughout the day line chart, 
@callback(
    Output('reqTypePieChart', 'figure'),
    Output('timeCloseHist', 'figure'),
    Output('numReqLineChart', 'figure'),
    Output('dataQualityOutput', 'children'),
    Input('nc_dropdown', 'value'),
    [Input('nc_dropdown_filter', 'value')],
    Input('dataQualitySwitch', 'value')
)
def generate_nc_summary_charts(nc_dropdown, nc_dropdown_filter=None, dataQualitySwitch=True):
    # NC Dropdown
    if not nc_dropdown:
        df = data_2020
    else:
        df = data_2020[data_2020['councilName'] == nc_dropdown]
    # Filter as per selection on Reqquest Type Dropdown
    if not nc_dropdown_filter and not nc_dropdown:
        df = data_2020
    elif nc_dropdown_filter:
        df = df[df['typeName'].isin(nc_dropdown_filter)]
  
  # Pie Chart for the distribution of Request Types
    rtype = pd.DataFrame(df['typeName'].value_counts())
    rtype = rtype.reset_index()
    reqTypePieChart = px.pie(rtype, values="typeName", names="index", title="Share of each Request Type")
    reqTypePieChart.update_layout(margin=dict(l=50, r=50, b=50, t=50), legend_title = dict(font = dict(size = 10)), font=dict(size=9))

    # Distribution of Time to Close Date of each request
    ## Calculate the Time to Closed
    df.loc[:, 'createDateDT'] = pd.to_datetime(df.loc[:, 'createdDate'].str[:-4].str.split("T").str.join(" "))
    df.loc[:, 'closeDateDT'] = pd.to_datetime(df.loc[:, 'closedDate'].str[:-4].str.split("T").str.join(" "))
    df.loc[:, 'timeToClose'] = (df.loc[:, 'closeDateDT'] - df.loc[:, 'createDateDT']).dt.days

    ## Calculate the Optimal number of bins based on Freedman-Diaconis Rule

    # Replace empty rows with 0.0000001 To avoid log(0) error later
    df.loc[:, "timeToClose"] = df.loc[:, "timeToClose"].fillna(0.0000001)

    # Replace negative values
    # TODO: figure out what to do when there is no data avaialble
    df = df[df['timeToClose'] > 0]
    print(df.shape)
    if df.shape[0] == 0:
        raise PreventUpdate()
    else:
        q3, q1 = np.percentile(df.loc[:, "timeToClose"].astype(int), [75 ,25])
        iqr = q3 - q1
        if not iqr:
            numBins = 100
        else:
            numBins = int((2*iqr)/(df.shape[0]**(1/3)))

        # Log Transform, Compute IQR, then exclude outliers
        df.loc[:, "logTimeToClose"] = np.log(df.loc[:, "timeToClose"])
        log_q3, log_q1 = np.percentile(df.loc[:, "logTimeToClose"], [75 ,25])
        log_iqr = log_q3 - log_q1

    # Data Quality switch to remove outliers as defined by Median +- 1.5*IQR
    if dataQualitySwitch:
        # TODO: figure out what happens when the filtering mechanism output no data at all
        temp = df[(df.loc[:, "logTimeToClose"] > 1.5*log_iqr - np.median(df.loc[:, "logTimeToClose"])) & (df.loc[:, "logTimeToClose"] < 1.5*log_iqr + np.median(df.loc[:, "logTimeToClose"]))]
        if temp.shape[0] > 0:
            df = temp
        dataQualityOutput = "Quality Filter: On"
    else:
        dataQualityOutput = "Quality Filter: Off"

    # Distribution for the total number of requests
    timeCloseHist = px.histogram(df, x="timeToClose", title="Distribution of Time to Close Request", nbins= numBins, range_x=[min(df.loc[:, 'timeToClose']), max(df.loc[:, 'timeToClose'])], labels={"timeToClose":"Request Duration", "count":"Frequency"})
    timeCloseHist.update_layout(margin=dict(l=50, r=50, b=50, t=50), font=dict(size=9))

    ## Time Series for the Total Number of Requests
    
    # Implementation with Datetime 
    rtime = pd.DataFrame(df.groupby('createDateDT', as_index=False)['srnumber'].count())
    numReqLineChart = px.line(rtime, x="createDateDT", y = 'srnumber', title="Total Number of 311 Requests Overtime", labels={"createDateDT":"DateTime", "srnumber":"Frequency"} )
    numReqLineChart.update_layout(margin=dict(l=25, r=25, b=25, t=50), font=dict(size=9))


    ## Potentially applying stylistic changes according to previous version
    apply_figure_style(reqTypePieChart)
    apply_figure_style(timeCloseHist)
    apply_figure_style(numReqLineChart)

    return reqTypePieChart, timeCloseHist, numReqLineChart, dataQualityOutput

## Generate the charts and filters for NC Comparison Dashboards, including the following
@callback(
    Output('reqSourceBarChart', 'figure'),
    Output('reqSourceBarChart2', 'figure'),
    Output('totalReqCard', 'children'),
    Output('totalReqCard2', 'children'),
    Output('numDaysCard', 'children'),
    Output('numDaysCard2', 'children'),
    Output('overlayReqTimeLineChart', 'figure'),
    Input('nc_comp_dropdown', 'value'),
    Input('nc_comp_dropdown2', 'value'), 
    prevent_initial_call=True
)
def generate_nc_comparison_charts(nc_comp_dropdown, nc_comp_dropdown2):
    if not nc_comp_dropdown:
        df_nc1 = data_2020
    else:
        df_nc1 = data_2020[data_2020['councilName'] == nc_comp_dropdown]
    if not nc_comp_dropdown2:
        df_nc2 = data_2020
    else:
        df_nc2 = data_2020[data_2020['councilName'] == nc_comp_dropdown2]
    
    print(df_nc1.shape)
    df_nc1.loc[:, 'createDateDT'] = pd.to_datetime(df_nc1.loc[:, 'createdDate'].str[:-4].str.split("T").str.join(" "))
    df_nc2.loc[:, 'createDateDT'] = pd.to_datetime(df_nc2.loc[:, 'createdDate'].str[:-4].str.split("T").str.join(" "))



    # Bar chart of different Request Type Sources
    rSource = pd.DataFrame(df_nc1['sourceName'].value_counts())
    rSource = rSource.reset_index()
    reqSourceBarChart = px.bar(rSource, x="sourceName", y="index", orientation='h', title='Number of Requests by Source', labels={"index":"Request Source", "sourceName":"Frequency"})
    reqSourceBarChart.update_layout(margin=dict(l=25, r=25, b=25, t=50), font=dict(size=9))

    rSource2 = pd.DataFrame(df_nc2['sourceName'].value_counts())
    rSource2 = rSource2.reset_index()
    reqSourceBarChart2 = px.bar(rSource2, x="sourceName", y="index", orientation='h', title='Number of Requests by Source', labels={"index":"Request Source", "sourceName":"Frequency"})
    reqSourceBarChart2.update_layout(margin=dict(l=25, r=25, b=25, t=50) , font=dict(size=9))

    #  Indicator Variables for Total Requests 1
    totalReqCard = df_nc1.shape[0]

    # Indicator Variables for Total Requests 2
    totalReqCard2 = df_nc2.shape[0]

    # Indicator Visuals for the Number of Days the dataset spans 1

    numDaysCard = np.max(df_nc1['createDateDT'].dt.day) - np.min(df_nc1['createDateDT'].dt.day) + 1

    #  Indicator Visuals for the Number of Days the dataset spans 2
    numDaysCard2 = np.max(df_nc2['createDateDT'].dt.day) - np.min(df_nc2['createDateDT'].dt.day) + 1


    # Overlapping line chart for number of request throughout the day
    rTime = pd.DataFrame(df_nc1.groupby('createDateDT', as_index=False)['srnumber'].count())
    rTime2 = pd.DataFrame(df_nc2.groupby('createDateDT', as_index=False)['srnumber'].count())
    overlayReqTimeLineChart = go.Figure()
    overlayReqTimeLineChart.add_trace(go.Scatter(x=rTime['createDateDT'], y=rTime['srnumber'], mode='lines', name='NC1'))
    overlayReqTimeLineChart.add_trace(go.Scatter(x=rTime2['createDateDT'], y=rTime2['srnumber'], mode='lines', name='NC2'))

    overlayReqTimeLineChart.update_layout(title='Number of Request Throughout the Day', margin=dict(l=25, r=25, b=35, t=50), xaxis_range=[min(min(rTime['createDateDT']), min(rTime2['createDateDT'])), max(max(rTime['createDateDT']), max(rTime2['createDateDT']))], font=dict(size=9))

    apply_figure_style(reqSourceBarChart)
    apply_figure_style(reqSourceBarChart2)
    apply_figure_style(overlayReqTimeLineChart)



    return reqSourceBarChart, reqSourceBarChart2, totalReqCard, totalReqCard2, numDaysCard, numDaysCard2, overlayReqTimeLineChart



# Define callback to update graph
@callback(
    Output('ncAvgCompLineChart', 'figure'),
    [Input("nc_dropdown", "value")]
)
def update_figure(nc_dropdown):
    if not nc_dropdown:
        df = data_2020
    neighborhood_sum_df = df[df.council_name == nc_dropdown].groupby(['created_date']).agg('sum').reset_index()  # noqa
    total_sum_df = df.groupby(['created_date']).agg('sum').reset_index()
    total_sum_df["nc_avg"] = total_sum_df["counts"] / 99
    merged_df = neighborhood_sum_df.merge(total_sum_df["nc_avg"].to_frame(), left_index=True, right_index=True)  # noqa

    fig = px.line(
        merged_df,
        x="created_date",
        y=['counts', 'nc_avg'],
        color_discrete_sequence=DISCRETE_COLORS,
        labels=LABELS,
        title= "Number of " + nc_dropdown + " Requests compare with the average of all Neighborhood Councils requests"
    )

    fig.update_xaxes(
        tickformat="%a\n%m/%d",
    )

    fig.update_traces(
        mode='markers+lines'
    )  # add markers to lines

    apply_figure_style(fig)

    return fig