import React from 'react';
import PropTypes from 'proptypes';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

const TABS = [
  'address',
  'nc',
  'cc'
]

class MapSearch extends React.Component {
  state = {
    activeTab: 'address'
  };

  componentDidMount() {
    const { map, mapboxgl } = this.props;

    this.geocoder = new MapboxGeocoder({
      accessToken: process.env.MAPBOX_TOKEN,
      flyTo: false,
      mapboxgl: mapboxgl,
      marker: false,
      placeholder: 'Enter address',
    });

    this.geocoder.on('result', ({ result }) => {
      this.props.onGeocoderResult({ result });
    });

    document.getElementById('geocoder').appendChild(this.geocoder.onAdd(map));
  }

  setTab = tab => {
    if (tab !== this.state.activeTab) {
      console.log(this.geocoder);
      this.setState({ activeTab: tab })
      this.props.onChangeTab(tab);
      this.geocoder.clear();
      switch(tab) {
        case 'address': return this.geocoder.setPlaceholder('Enter address');
        case 'nc': return this.geocoder.setPlaceholder('Enter NC');
        case 'cc': return this.geocoder.setPlaceholder('Enter CC');
      }
    }
  }

  render() {
    return (
      <div className="map-search map-control">
        <div className="search-tabs">
          { TABS.map(tab => (
            <div
              key={tab}
              className="search-tab"
              onClick={this.setTab.bind(null, tab)}
            >
              { tab }
            </div>
          ))}
        </div>
        <div id="geocoder" />
      </div>
    );
  }
};

MapSearch.propTypes = {
  mapboxgl: PropTypes.shape({}),
  map: PropTypes.shape({}),
  onGeocoderResult: PropTypes.func,
  onChangeTab: PropTypes.func,
};

MapSearch.defaultProps = {
  mapboxgl: null,
  map: null,
  onGeocoderResult: () => {},
  onChangeTab: () => {},
};

export default MapSearch;
