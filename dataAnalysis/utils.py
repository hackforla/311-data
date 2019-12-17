import numpy as np
import pandas as pd
import random as rd
from datetime import datetime
from shapely import wkt

def fill_placeholder_1900(df):
    return df.replace(to_replace=pd.to_datetime('1900'),value=pd.NaT)

def to_datetime(df):
    dt_cols = ['CreatedDate','UpdatedDate','ServiceDate','ClosedDate']
    for col in dt_cols:
        df[col] = pd.to_datetime(df[col])

def fill_placeholder_1900_col(df):
    dt_cols = ['CreatedDate','UpdatedDate','ServiceDate','ClosedDate']
    for col in dt_cols:
        df[col] = df[col].replace(to_replace=pd.to_datetime('1900'),value=pd.NaT)

def fill_placeholder_ongoing(df, cols):
    for col in cols:
        df[col] = df[col].replace(to_replace=pd.NaT, value=datetime.now())
        # df.loc[df[col] == 'NaT', col] = datetime.now()

def ddiff2days(ddiff):
    if not pd.isnull(ddiff):
        return pd.Timedelta.total_seconds(ddiff)/(24.*3600)
    else:
        return np.NaN

def to_points(p):
    if type(p) == float:
        return p
    else:
        return wkt.loads('Point{}'.format(p.replace(',',' ')))
    
def to_geom(df):
    df['Location'] = df.Location.apply(to_points)

def add_datediff_cols(df):
    df['ClosedDiff'] = df.ClosedDate - df.CreatedDate
    df['ServiceDiff'] = df.ServiceDate - df.CreatedDate
    df['ClosedServiceDiff'] = df.ClosedDate - df.ServiceDate
    df['ClosedDiff_Days'] = df.ClosedDiff.apply(ddiff2days)
    df['ServiceDiff_Days'] = df.ServiceDiff.apply(ddiff2days)
    df['ClosedServiceDiff_Days'] = df.ClosedServiceDiff.apply(ddiff2days)

def combine_coor(dataset):
    """
    Processes the raw dataset into workable geospatial coordinates
    Returns a 2D array of Latitude-Longitude coordinates 
    dataset: must be lacity's raw 311-call dataset 
    """
    df = pd.read_csv(dataset).dropna(subset=['Longitude'])
    df = df.head(100)

    return np.transpose([df['Latitude'], df['Longitude']])

def k_init(dataset, k):
    """
    Initial step of the k-means algorithm: returns random coordinates as representatives (centroid candidates)
    dataset: path to dataset; must be lacity's raw 311-call dataset 
    k: number of desired clusters
    """
    data_arr = combine_coor(dataset)

    if k > len(data_arr):
        return "Error: more means than data points"

    index_arr = rd.sample(range(0, len(data_arr)), k)
    k_arr = []

    for i in index_arr:
        k_arr.append(data_arr[i])
    
    return k_arr

def k_means(data_arr, k, reps):
    """
    Standard k-means algorithm: returns an updated set of means and corresponding clusters as a 2-element 1D array
    data_arr: array of processed coordinate data
    k: number of desired clusters
    reps: representatives (centroid candidates) of each cluster
    """

    # Step-1: Clusters every point to the closest centroid 

    clusters = []
    count = 0

    while count < k:
        clusters.append([])
        count += 1

    for point in data_arr:
        distance = []

        for rep in reps:
            magnitude = np.sqrt(np.absolute(point[0] - rep[0])**2 + np.absolute(point[1] - rep[1])**2)
            distance.append(magnitude)

        clusters[np.argmin(distance)].append(point)

    # Step-2: Update the centroids based on the clusters
    
    means = []

    for cluster in clusters:
        sum_c = [0, 0]

        for c in cluster:
            sum_c[0] += c[0]
            sum_c[1] += c[1]

        mean = [ci / len(cluster) for ci in sum_c]
        means.append(mean)

    return [means, clusters]

def run_kmeans(dataset, k, manual=False, reps=[], t=1000):
    """
    Runs the k-means algorithm, returns a dictionary of mean-cluster pairs
    t: number of times to iterate through the algorithm
    dataset: path to dataset; must be lacity's raw 311-call dataset
    k: number of desired clusters
    manual: random initialization of initial representatives if False; custom initialization if True
    reps: representatives; should be used only if manual=True
    """
    data_arr = combine_coor(dataset)

    ### Due to the high variance of random initialization, it is recommended in practice to manually set the initial representatives in practice

    if manual:
        reps = reps
    else:
        reps = k_init(dataset, k)

    runs = 0

    while runs < t:
        results = k_means(data_arr, k, reps)
        reps = results[0]
        print(reps, runs)
        runs += 1

    for j in range(k):
        results[1][j] = [tuple(p) for p in results[1][j]]

    k_clusters = {}
    for i in np.arange(len(results[0])):
        k_clusters[tuple(results[0][i])] = results[1][i]

    print(k_clusters.keys())
    return k_clusters
    
### Example: runs the algorithm using 3 clusters

run_kmeans('../rawdata/MyLA311_Service_Request_Data_2015.csv', 3)

### Incomplete k-medoids algorithm
### The K-medoids algorithm forces an existing data point as the centroid

# def medoid_L1 (data, representatives):
#     clusters = []
#     for r in np.arange(len(representatives)):
#         clusters.append([])

#     for i in data:
#         dist = []

#         for j in representatives:
#             norm_l1 = np.absolute(i[0] - j[0]) + np.absolute(i[1] - j[1])
#             dist.append(norm_l1)

#         clusters[np.argmin(dist)].append(i)

#     print(clusters)
#     z_min = []
    
#     for ci in clusters:
#         sum_dist = []

#         for z in data:
#             sum_cz = 0

#             for c in ci:
#                 sum_cz += np.absolute(c[0] - z[0]) + np.absolute(c[1] - z[1])
            
#             sum_dist.append(sum_cz)

#         z_min.append(data[np.argmin(sum_dist)])
    
#     print(z_min)

# def medoid_L2 (data, representatives):
#     clusters = []
#     for r in np.arange(len(representatives)):
#         clusters.append([])

#     for i in data:
#         dist = []

#         for j in representatives:
#             norm_l2 = np.sqrt(np.absolute(i[0] - j[0])**2 + np.absolute(i[1] - j[1])**2)
#             dist.append(norm_l2)

#         clusters[np.argmin(dist)].append(i)

#     print(clusters)
#     z_min = []
    
#     for ci in clusters:
#         sum_dist = []

#         for z in data:
#             sum_cz = 0

#             for c in ci:
#                 sum_cz += np.sqrt(np.absolute(c[0] - z[0])**2 + np.absolute(c[1] - z[1])**2)
            
#             sum_dist.append(sum_cz)

#         z_min.append(data[np.argmin(sum_dist)])
    
#     print(z_min)