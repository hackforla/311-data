import requests
import os
from tqdm import tqdm
import duckdb
import geopandas as gpd
import pandas as pd
import glob
from shapely.geometry import Point
from huggingface_hub import HfApi, login
from dotenv import load_dotenv
load_dotenv()


# # Define download function
def dlData():
    """
    Download the dataset from data.lacity.org
    """
    url = "https://data.lacity.org/api/views/b7dx-7gc3/rows.csv?accessType=DOWNLOAD"
    outfile = "2024.csv"

    response = requests.get(url, stream=True)

    # Save downloaded file
    with open(outfile, "wb") as file:
        for data in tqdm(response.iter_content()):
            file.write(data)

# Define cleaning function
def hfClean():
    """
    Clean the dataset by removing problematic strings and update timestamp to ISO format
    """
    infile = "2024.csv"
    fixed_filename = "2024-fixed.csv"
    clean_filename = "2024-clean.parquet"

    # List of problematic strings to be replaced with ""
    replace_strings = ["VE, 0"]

    conn = duckdb.connect(database=':memory:')

    try:
        # Clean and save modified file
        with open(infile, "r") as input_file, open(fixed_filename, "w") as output_file:
            for line in input_file:
                for replace_string in replace_strings:
                    line = line.replace(replace_string, "")
                output_file.write(line)

        # Open modified file and perform an import/export to duckdb to ensure timestamps are formatted correctly
        conn.execute(
            f"create table requests as select * from read_csv_auto('{fixed_filename}', header=True, timestampformat='%m/%d/%Y %H:%M:%S %p');")
        conn.execute(
            f"copy (select * from requests) to '{clean_filename}' with (FORMAT PARQUET);")

    except FileNotFoundError:
        print(f"File {infile} not found.")



# Define filtering function hfFilter 

def hfFilter():

    """
    Filter data points within a specific geographic boundary

    This function filters points from a Parquet file within a GeoJSON boundary, 
    saving filtered and outside points to separate Parquet files

    """

    geojson_file="./data/nc-boundary-2019-modified.json"
    input_parquet_file = "2024-clean.parquet"
    filtered_parquet_path = "filtered_data.parquet"
    outside_parquet_path = "outside_boundary_data.parquet"

    # Check if the Geocd JSON file exists
    if not os.path.exists(geojson_file):
        raise FileNotFoundError(f"GeoJSON file not found at {geojson_file}")
    print("GeoJSON file found locally.")

    # Load Parquet data and GeoDataFrame
    df = pd.read_parquet(input_parquet_file)
    gdf = gpd.read_file(geojson_file)

    # Convert DataFrame to GeoDataFrame with Point geometries
    geometry = [Point(lon, lat) for lon, lat in zip(df['Longitude'], df['Latitude'])]
    gdf_points = gpd.GeoDataFrame(df, geometry=geometry, crs='EPSG:4326')

    # Ensure both GeoDataFrames are in the same Coordinate Reference System (CRS)
    gdf = gdf.to_crs(gdf_points.crs)

    # Perform a spatial join to check if points fall within polygons
    merged_gdf = gpd.sjoin(gdf_points, gdf, how='left', predicate='within')

    # Points within the boundary
    filtered_df = merged_gdf[merged_gdf.index_right.notnull()]

    # Points outside the boundary
    outside_df = merged_gdf[merged_gdf.index_right.isnull()]

    # # Convert ZipCode column to numeric (if applicable)
    # filtered_df.loc[:, 'ZipCode'] = pd.to_numeric(filtered_df['ZipCode'], errors='coerce')
    # outside_df.loc[:, 'ZipCode'] = pd.to_numeric(outside_df['ZipCode'], errors='coerce')

    # Print data shapes
    print("Initial data shape: {}".format(df.shape))
    print("Filtered data shape: {}".format(filtered_df.shape))
    print("Outside boundary data shape: {}".format(outside_df.shape))

    # Save the filtered DataFrame to a Parquet file
    filtered_df.to_parquet(filtered_parquet_path, index=False)
    print("Filtered data saved to Parquet file successfully.")

    # Save the outside boundary DataFrame to a Parquet filecd 
    outside_df.to_parquet(outside_parquet_path, index=False)
    print("Outside boundary data saved to Parquet file successfully.")

"""
# Filter Data Points Within a Specific Geographic Boundary Using GeoJSON

## Purpose:
This function, `hfFilter`, filters points from a Parquet file based on a GeoJSON boundary. 
It generates two separate Parquet files: 
- One for points inside the boundary.
- One for points outside the boundary.

Both filtered and non-filtered datasets are required for visualization and validation during testing.

## Local Testing Steps:
1. Disable the function calls to hfUpload() and cleanUp() in the main() function by using # to comment them out

2. After running the script, verify that both Parquet files are generated correctly by `hfFilter()`.

3. Copy the generated files to `311-data/public` (local testing files must be under the `public` folder).

4. Modify Data Source:
   - Navigate to `311-data/components/db/DbProvider.jsx`.
   - Replace the Hugging Face link for the 2024 dataset:
     # 'https://huggingface.co/datasets/311-data/2024/resolve/main/2024.parquet'
     with local file paths:
     - For filtered data: `'/filtered_data.parquet'`
     - For outside-boundary data: `'/outside_boundary_data.parquet'`

5. Run the script and check the local map on `localhost` to visualize which points fall inside and outside the boundaries.

## Future Hugging Face Integration Testing:
6. If everything works as expected (steps 1 to 5):
   - Modify `hfUpload()` so that `local_filename = 'filtered_data.parquet'` instead of `'2024-clean.parquet'`. 
     This will upload the filtered data to Hugging Face.
   - If uploading data outside the boundary is also required, adjust the script accordingly.

7. Delete both Parquet files from the `public` folder.

8. Change the data source path back to the Hugging Face link.

9. Enable the `hfUpload()` and `cleanUp()` functions.

10. Use `updateHfDataset_FilterByBoundaries.py` in the cron job instead of `updateHfDataset.py`. Do the final integration test.
"""


def hfUpload():
    '''
    Upload the clean dataset to huggingface.co
    '''
    local_filename = '2024-clean.parquet' 
    dest_filename = '2024.parquet'
    username = '311-data'
    repo_name = '2024'
    repo_type = 'dataset'

    repo_id = f"{username}/{repo_name}"
    TOKEN = os.getenv('HUGGINGFACE_LOGIN_TOKEN')

    login(TOKEN)
    api = HfApi()
    api.upload_file(
        path_or_fileobj=local_filename,
        path_in_repo=dest_filename,
        repo_id=repo_id,
        repo_type=repo_type,
    )


def cleanUp():
    for file in glob.glob('*.csv'):
        os.remove(file)
    for file in glob.glob('*.parquet'):
        os.remove(file)   



def main():
    dlData()
    hfClean()
    hfFilter()
    #hfUpload()
    #cleanUp()

if __name__ == "__main__":
    main()    