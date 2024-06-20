import geopandas as gpd
import pandas as pd
from shapely.geometry import Point
import os

# File paths
geojson_file = "./nc-boundary-2019-modified.json"
input_csv_file = "./2024.csv"
filtered_csv_path = "./Data_csvfiles/filtered_data.csv"
outside_csv_path = "./Data_csvfiles/outside_boundary_data.csv"
filtered_parquet_path= "./Data_csvfiles/filtered_data.parquet"
outside_parquet_path = "./Data_csvfiles/outside_boundary_data.parquet"


# Check if the GeoJSON file exists
if os.path.exists(geojson_file):
    print("GeoJSON file found locally.")
else:
    raise FileNotFoundError(f"GeoJSON file not found at {geojson_file}")

# Load the CSV data
df = pd.read_csv(input_csv_file)

# Load the GeoDataFrame from the GeoJSON file
gdf = gpd.read_file(geojson_file)

# Convert DataFrame to GeoDataFrame with Point geometries
geometry = [Point(lon, lat) for lon, lat in zip(df['Longitude'], df['Latitude'])]
gdf_points = gpd.GeoDataFrame(df, geometry=geometry, crs='EPSG:4326')

# Ensure both GeoDataFrames are in the same CRS
gdf = gdf.to_crs(gdf_points.crs)

# Perform a spatial join to check if points fall within polygons
merged_gdf = gpd.sjoin(gdf_points, gdf, how='left', predicate='within')

# Points within the boundary
filtered_df = merged_gdf[merged_gdf.index_right.notnull()]

# Points outside the boundary
outside_df = merged_gdf[merged_gdf.index_right.isnull()]

# Replace specific strings in the DataFrame (if needed)
replace_strings = ["VE, 0"]
filtered_df.replace(to_replace=replace_strings, value="", inplace=True)
outside_df.replace(to_replace=replace_strings, value="", inplace=True)

# Convert ZipCode column to numeric (if applicable)
filtered_df['ZipCode'] = pd.to_numeric(filtered_df['ZipCode'], errors='coerce')
# Convert ZipCode column to numeric (if applicable)
outside_df['ZipCode'] = pd.to_numeric(outside_df['ZipCode'], errors='coerce')

# Print the initial, final, and outside data shapes
print("Initial data shape: {}".format(df.shape))
print("Filtered data shape: {}".format(filtered_df.shape))
print("Outside boundary data shape: {}".format(outside_df.shape))

# Save the filtered DataFrame to a CSV file
os.makedirs(os.path.dirname(filtered_csv_path), exist_ok=True)
filtered_df.to_csv(filtered_csv_path, index=False)
print("Filtered data saved to CSV file successfully.")

# Save the outside boundary DataFrame to a CSV file
os.makedirs(os.path.dirname(outside_csv_path), exist_ok=True)
outside_df.to_csv(outside_csv_path, index=False)
print("Outside boundary data saved to CSV file successfully.")

# Save the filtered DataFrame to a Parquet file
os.makedirs(os.path.dirname(filtered_parquet_path), exist_ok=True)
filtered_df.to_parquet(filtered_parquet_path, index=False)
print("Filtered data saved to Parquet file successfully.")


# Save the filtered DataFrame to a Parquet file
os.makedirs(os.path.dirname(outside_parquet_path), exist_ok=True)
outside_df.to_parquet(outside_parquet_path, index=False)
print("Filtered data saved to Parquet file successfully.")
