import React from 'react';
import PropTypes from 'proptypes';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { COUNCILS, CITY_COUNCILS } from '@components/common/CONSTANTS';
import clx from 'classnames';

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
      minLength: 1,
      placeholder: 'Enter address',
      localGeocoder: searchTerm => {
        const searchFilter = new RegExp(searchTerm, 'i');

        switch(this.state.activeTab) {
          case 'address':
            return [];

          case 'nc':
            const filteredNCs = COUNCILS.filter(nc => searchFilter.test(nc.name));
            return filteredNCs.map(nc => ({
              type: 'Feature',
              id: nc.id,
              text: nc.name,
              place_name: nc.name,
              properties: {
                type: 'nc'
              }
            }));

          case 'cc':
            const filteredCCs = CITY_COUNCILS.filter(cc => searchFilter.test(cc.name));
            return filteredCCs.map(cc => ({
              type: 'Feature',
              id: cc.id,
              text: cc.name,
              place_name: cc.name,
              properties: {
                type: 'cc'
              }
            }));
        }
      },
      localGeocoderOnly: false
    });

    this.geocoder.on('result', ({ result }) => {
      this.props.onGeocoderResult({ result });
      this.geocoder.clear();
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
          this.geocoder.setPlaceholder('Enter neighborhood council');
          this.geocoder.options.localGeocoderOnly = true;
          break;

        case 'cc':
          this.geocoder.setPlaceholder('Enter city council number');
          this.geocoder.options.localGeocoderOnly = true;
          break;
      }
    }
  }

  render() {
    return (
      <div className="map-search map-control">
        <div>
          <div className="search-tabs">
            { TABS.map(tab => (
              <div
                key={tab}
                className={clx('search-tab', {
                  active: tab === this.state.activeTab
                })}
                onClick={this.setTab.bind(null, tab)}
              >
                { tab }
              </div>
            ))}
          </div>
          <div className="search-content">
            <div id="geocoder" />
          </div>
        </div>
        <div className="search-buttons">
          { this.props.canReset && (
            <div
              className="search-button"
              onClick={this.props.onReset}
            >
              Reset
            </div>
          )}
        </div>
      </div>
    );
  }
};

MapSearch.propTypes = {
  map: PropTypes.shape({}),
  onGeocoderResult: PropTypes.func,
  onChangeTab: PropTypes.func,
  onReset: PropTypes.func,
  canReset: PropTypes.bool,
};

MapSearch.defaultProps = {
  map: null,
  onGeocoderResult: () => {},
  onChangeTab: () => {},
  onReset: () => {},
  canReset: false
};

export default MapSearch;
