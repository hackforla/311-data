import React from 'react';
import PropTypes from 'proptypes';
import clx from 'classnames';
import { withStyles } from '@material-ui/core/styles'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { COUNCILS, CITY_COUNCILS } from '@components/common/CONSTANTS';
import { GEO_FILTER_TYPES } from '../constants';
import { ncBoundaries } from '../districts';

const TABS = Object.values(GEO_FILTER_TYPES);

const styles = theme => ({
  searchContainer: {
    // TODO: geocoder refactor, styles
    display: 'none',
  }
})

class MapSearch extends React.Component {
  componentDidMount() {
    const { map } = this.props;

    this.geocoder = new MapboxGeocoder({
      accessToken: process.env.MAPBOX_TOKEN,
      flyTo: false,
      marker: false,
      minLength: 1,
      localGeocoder: searchTerm => {
        const { geoFilterType } = this.props;
        const searchFilter = new RegExp(searchTerm, 'i');

        switch(geoFilterType) {
          case GEO_FILTER_TYPES.address:
            return [];

          case GEO_FILTER_TYPES.nc:
            const filteredNCs = COUNCILS.filter(nc => (
              searchFilter.test(nc.name)
              // United For Victory and Central Avenue Historic aren't in the nc-boundary json,
              // so they need to be excluded from search results
              && ncBoundaries.features.find(f => f.properties.nc_id == nc.id)
            ));
            return filteredNCs.map(nc => ({
              type: 'Feature',
              id: nc.id,
              text: nc.name,
              place_name: nc.name,
              properties: {
                type: GEO_FILTER_TYPES.nc
              }
            }));

          case GEO_FILTER_TYPES.cc:
            const filteredCCs = CITY_COUNCILS.filter(cc => searchFilter.test(cc.name));
            return filteredCCs.map(cc => ({
              type: 'Feature',
              id: cc.id,
              text: cc.name,
              place_name: cc.name,
              properties: {
                type: GEO_FILTER_TYPES.cc
              }
            }));
        }
      },
    });

    this.geocoder.on('result', ({ result }) => {
      this.props.onGeocoderResult({ result });
      this.geocoder.clear();
    });

    document.getElementById('geocoder').appendChild(this.geocoder.onAdd(map));
    this.setTab(GEO_FILTER_TYPES.nc);
  }

  setTab = tab => {
    const { geoFilterType } = this.props;
    if (tab !== geoFilterType) {
      this.props.onChangeTab(tab);
      this.geocoder.clear();
      switch(tab) {
        case GEO_FILTER_TYPES.address:
          this.geocoder.setPlaceholder('Enter address');
          this.geocoder.options.localGeocoderOnly = false;
          break;

        case GEO_FILTER_TYPES.nc:
          this.geocoder.setPlaceholder('Enter neighborhood council');
          this.geocoder.options.localGeocoderOnly = true;
          break;

        case GEO_FILTER_TYPES.cc:
          this.geocoder.setPlaceholder('Enter city council number');
          this.geocoder.options.localGeocoderOnly = true;
          break;
      }
    }
  }

  render() {
    const { geoFilterType, classes } = this.props;
    return (
      <div className={classes.searchContainer}>
        <div>
          <div className="map-control-tabs">
            { TABS.map(tab => (
              <div
                key={tab}
                className={clx('map-control-tab', {
                  active: tab === geoFilterType
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

export default withStyles(styles)(MapSearch);
