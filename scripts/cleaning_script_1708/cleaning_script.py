import requests
import json
import geopandas as gpd
import pandas as pd
from shapely.geometry import Point
import os

# Fetch the content of the URL
response = requests.get("https://raw.githubusercontent.com/hackforla/311-data/main/data/nc-boundary-2019-modified.json")

# Check if the request was successful
if response.status_code == 200:
    # Save the data to a file
    save_path = "./scripts/cleaning_script_1708/nc-boundary-2019-modified.json"
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    with open(save_path, "w") as file: 
        file.write(response.text)
    print("Data saved successfully.")
else:
    print("Failed to fetch data:", response.status_code)

# File paths
output_file = "./scripts/cleaning_script_1708/Data_csvfiles/2024_original.csv"
geojson_file = "./scripts/cleaning_script_1708/nc-boundary-2019-modified.json"

# Load the CSV data
df = pd.read_csv(output_file)

# Load the GeoDataFrame from the GeoJSON file
gdf = gpd.read_file(geojson_file)

# Convert DataFrame to GeoDataFrame with Point geometries
geometry = [Point(lon, lat) for lon, lat in zip(df['Longitude'], df['Latitude'])]
gdf_points = gpd.GeoDataFrame(df, geometry=geometry, crs='EPSG:4326')

# Perform a spatial join to check if points fall within polygons
merged_gdf = gpd.sjoin(gdf_points, gdf, how='inner', op='within')

# Extract the filtered DataFrame
filtered_df = merged_gdf[df.columns]

# Replace specific strings in the DataFrame (if needed)
replace_strings = ["VE, 0"]
filtered_df.replace(to_replace=replace_strings, value="", inplace=True)

# Print the initial and final data shapes
print("Initial data shape: {}".format(df.shape))
print("Final data shape: {}".format(filtered_df.shape))

# Save the filtered DataFrame to a CSV file
filtered_csv_path = "./scripts/cleaning_script_1708/Data_csvfiles/filtered_data.csv"
#os.makedirs(os.path.dirname(filtered_csv_path), exist_ok=True)
filtered_df.to_csv(filtered_csv_path, index=False)
print("Filtered data saved to CSV file successfully.")

