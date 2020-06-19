'''
Calculates the centroids of all the nc's and dumps them in a pickle file.
'''

from os.path import join, dirname
import geopandas as geo


DATA_DIR = join(dirname(__file__), '../data')
IN_FILE = join(DATA_DIR, 'nc-boundary-2019.json')
OUT_FILE = join(DATA_DIR, 'centroids.pkl')


if __name__ == '__main__':
    gdf = geo.read_file(IN_FILE)

    # calc centroids
    gdf['centroid'] = gdf.geometry.centroid
    gdf['longitude'] = gdf.centroid.apply(lambda p: p.x)
    gdf['latitude'] = gdf.centroid.apply(lambda p: p.y)

    # clean up
    gdf['nc'] = gdf['nc_id'].astype('int')
    gdf.loc[gdf.name == 'NORTH WESTWOOD NC', 'nc'] = 127
    gdf.loc[gdf.name == 'HISTORIC CULTURAL NORTH NC', 'nc'] = 128

    gdf[['nc', 'longitude', 'latitude']] \
        .sort_values('nc') \
        .reset_index(drop=True) \
        .to_pickle(OUT_FILE)
