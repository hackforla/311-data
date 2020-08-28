import pysupercluster


def get_clusters_for_pins(pins, zoom, bounds, options):
    """
    Cluster pins into aggregate values using pysupercluster
    based on filters and user view
    """
    if len(pins) == 0:
        return []

    min_zoom = options.get('min_zoom', 0)
    max_zoom = options.get('max_zoom', 17)
    radius = options.get('radius', 200)
    extent = options.get('extent', 512)

    index = pysupercluster.SuperCluster(
        pins[['longitude', 'latitude']].to_numpy(),
        min_zoom=min_zoom,
        max_zoom=max_zoom,
        radius=radius,
        extent=extent)

    north = bounds.get('north', 90)
    south = bounds.get('south', -90)
    west = bounds.get('west', -180)
    east = bounds.get('east', 180)

    clusters = index.getClusters(
        top_left=(west, north),
        bottom_right=(east, south),
        zoom=zoom)

    for cluster in clusters:
        if cluster['count'] == 1:
            pin = pins.iloc[cluster['id']]
            cluster['srnumber'] = pin['srnumber']
            cluster['requesttype'] = pin['requesttype']
            del cluster['expansion_zoom']

    return clusters
