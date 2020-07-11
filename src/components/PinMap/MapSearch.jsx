import React from 'react';
import PropTypes from 'proptypes';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { COUNCILS } from '@components/common/CONSTANTS';

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
      marker: false,
      placeholder: 'Enter address',
      localGeocoder: searchTerm => {
        switch(this.state.activeTab) {
          case 'address':
            return [];

          case 'nc':
            const searchFilter = new RegExp(searchTerm, 'i');
            const filteredItems = COUNCILS.filter(item => searchFilter.test(item.name));
            return filteredItems.map(item => ({
              type: 'Feature',
              id: item.id,
              text: item.name,
              place_name: item.name,
              properties: {
                type: 'nc'
              }
            }));

          case 'cc':
            return [];
        }
      },
      localGeocoderOnly: false
    });

    this.geocoder.on('result', ({ result }) => {
      this.props.onGeocoderResult({ result });
    });

    document.getElementById('geocoder').appendChild(this.geocoder.onAdd(map));
  }

  setTab = tab => {
    if (tab !== this.state.activeTab) {
      this.setState({ activeTab: tab })
      this.props.onChangeTab(tab);
      this.geocoder.clear();
      switch(tab) {
        case 'address':
          this.geocoder.setPlaceholder('Enter address');
          this.geocoder.options.localGeocoderOnly = false;
          break;

        case 'nc':
          this.geocoder.setPlaceholder('Enter NC');
          this.geocoder.options.localGeocoderOnly = true;
          break;

        case 'cc':
          this.geocoder.setPlaceholder('Enter CC');
          this.geocoder.options.localGeocoderOnly = true;
          break;
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
