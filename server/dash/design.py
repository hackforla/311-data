
DISCRETE_COLORS = [
    '#267370',
    '#8B508B',
    '#EDAD08',
    '#1D6996',
    '#11975F',
    '#E17C05',
    '#685DB1',
    '#AE3D51',
    '#79B74E',
    '#BF82BA',
    '#D05F4E',
]

LABELS = {
    "created_year": "Year",
    "created_month": "Month",
    "created_date": "Date Requested",
    "createdDate": "Date Requested",
    "council_name": "Neighborhood",
    "councilName": "Neighborhood",
    "type_name": "Request Type",
    "typeName": "Request Type",
    'agencyName': "Agency Name",
    'agency_name': "Agency Name",
    'sourceName': "Source Name",
    'source_name': "Source Name",
    "day_of_week": "Day of Week Requested",
    "counts": "Total Requests",
    "value": "Total Requests",
    "srnumber": "Total Requests",
}

CONFIG_OPTIONS = {
    'modeBarButtonsToRemove': [
        'lasso2d',
        'toggleHover',
        'toggleSpikelines',
        'pan2d,'
        'select2d',
        'hoverClosestCartesian',
        'hoverCompareCartesian',
        'resetScale2d',
    ],
    'displaylogo': False,
}


# TODO: Fixing multiple streetlights and waterwaste color
# Request Type Color Hex Code Reference: https://github.com/hackforla/311-data/blob/b0717ad25eab4ef25a2f26da187d9d8905ab5f77/server/api/alembic/seeds/types.csv
# Need to add another discrete color
DISCRETE_COLORS_MAP = {
    "Graffiti":"#BF82BA",
    "Homeless Encampment":"#11975F",
    "Animal Remains":"#267370",
    "Bulky Items": "#D05F4E",
    "Electronic Waste": "#AE3D51",
    "Illegal Dumping": "#685DB1",
    "Metal/Appliances": "#8B508B",
    "Single Streetlight": "#79B74E",
    "Multiple Streetlights": "#EDAD08",
    "Water Waste": "#EDAD08",
     "Other": "#1D6996",
     "Feedback":  "#E17C05"
}


def apply_figure_style(fig):

    fig.update_layout(
        paper_bgcolor='#0F181F',
        geo_bgcolor='#0F181F',
        plot_bgcolor='#29404F',
        title_x=0.5,
        title_yanchor='top',
        font_family="Roboto, Arial",
        font_color="#ECECEC",
        colorway=DISCRETE_COLORS,
        margin_l=10,
        margin_r=10,
        legend_font_size=11,
        legend_title_text='',
        legend=dict(
            yanchor="auto",
            valign='top',
            # orientation="h",
            # x=-1
            # y=1.02,
            # xanchor="right",
            # x=1
        )
    )

    fig.update_xaxes(
        showgrid=True,
        gridwidth=1,
        gridcolor='#1A2832',
        ticks="outside",
        title_font_color="#999999"
    )

    fig.update_yaxes(
        showgrid=True,
        gridwidth=1,
        gridcolor='#1A2832',
        ticks="outside",
        title_font_color="#999999"
    )
