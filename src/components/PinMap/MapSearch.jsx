import React from 'react';
import PropTypes from 'proptypes';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

class MapSearch extends React.Component {
  componentDidMount() {
    const { map, mapboxgl } = this.props;

    this.geocoder = new MapboxGeocoder({
      accessToken: process.env.MAPBOX_TOKEN,
      flyTo: false,
      mapboxgl: mapboxgl,
      marker: false
    });

    this.geocoder.on('result', ({ result }) => {
      this.props.onGeocoderResult({ result });
    });

    document.getElementById('geocoder').appendChild(this.geocoder.onAdd(map));
  }

  render() {
    return (
      <div className="map-search map-control">
        <div id="geocoder" />
      </div>
    );
  }
};

MapSearch.propTypes = {
  mapboxgl: PropTypes.shape({}),
  map: PropTypes.shape({}),
  onGeocoderResult: PropTypes.func
};

MapSearch.defaultProps = {
  mapboxgl: null,
  map: null,
  onGeocoderResult: () => {}
};

export default MapSearch;
