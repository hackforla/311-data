/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { GEO_FILTER_TYPES } from '../constants';
import settings from '@settings'

const TABS = Object.values(GEO_FILTER_TYPES);

const styles = theme => ({
  geocoder: {
    width: 325,
    backgroundColor: theme.palette.primary.dark,
    borderTopRightRadius: '10px',
    borderTopLeftRadius: '10px',
    padding: '10px 15px 10px 15px',
    '& div.mapboxgl-ctrl': {
      width: '100%',
      borderRadius: 0,
      borderBottom: `1px solid ${theme.palette.primary.focus}`,
      '& svg': {
        color: theme.palette.primary.focus,
        fill: theme.palette.primary.focus,
      },
      '& button.mapboxgl-ctrl-geocoder--button': {
        backgroundColor: theme.palette.primary.dark,
      },
      '& input': {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.text.secondaryLight,
        '&::placeholder': {
          ...theme.typography.body2,
          color: theme.palette.text.secondaryDark,
        },
      }
    }
  },
  wrapper: {
    '& button:first-child': {
      borderRadius: '10px 0 0 0',
    },
    '& button:last-child': {
      borderRadius: '0 10px 0 0',
    },
  },
  button: {
    backgroundColor: '#0F181F',
    color: theme.palette.secondary.main,
    ...theme.typography.body1,
  },
  active: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.secondaryLight,
  },
});

class MapSearch extends React.Component {
  // Array to keep track of event listeners for memory management
  listeners = []  

  // addListener attaches a new event `listener` to `element` with `eventName` type of event
  // and adds it to the listeners array 
  addListener(element, eventName, listener) {
    element.addEventListener(eventName, listener);
    this.listeners.push(listener);
  }

  // removeListeners removes and frees all memory associated with `eventName` type of event
  // in the listeners array 
  removeListeners(element, eventName) {
    this.listeners.forEach(listener => element.removeEventListener(eventName, listener));
  }

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
            const { councils } = this.props;
            const filteredCouncils = councils.filter(({ councilName }) => (
              searchFilter.test(councilName)
            ));
            return filteredCouncils.map(council => ({
              type: 'Feature',
              id: council.councilId,
              text: council.councilName,
              place_name: council.councilName,
              properties: {
                type: GEO_FILTER_TYPES.nc,
              }
            }));
        }
      },
    });

    // This event fires upon an Address Search submission
    this.geocoder.on('result', ({ result }) => {
      this.props.onGeocoderResult({ result });
      
      // This clears the address from the Address input field.
      // this.geocoder.clear(); 
    });

    const geocoderElement = document.getElementById('geocoder')
    geocoderElement.appendChild(this.geocoder.onAdd(map));

    // Add a custom event listener to clear the Address Search Input field
    this.addListener(geocoderElement, settings.map.eventName.reset, ()=>this.geocoder.clear() )
    
    // this.setTab(GEO_FILTER_TYPES.address);
  }

  componentWillUnmount() {
    // Free memory and remove all event listeners
    const geocoderElement = document.getElementById('geocoder')
    removeListeners(geocoderElement, settings.map.eventName.reset)
  }

  setTab = tab => {
    this.props.onChangeTab(tab);
    this.geocoder.clear();
    this.geocoder.setPlaceholder(`Enter ${tab.toLowerCase()}`);
    switch(tab) {
      case GEO_FILTER_TYPES.address:
        this.geocoder.options.localGeocoderOnly = false;
        break;
      case GEO_FILTER_TYPES.nc:
        this.geocoder.options.localGeocoderOnly = true;
        break;
    }
  }

  render() {
    const { classes, geoFilterType } = this.props;
    return (
      <div>
        {/* To show Address & District Tabs (above the address input), uncomment below */}
        {/* <div className={classes.wrapper}>
        { TABS.map(tab => (
            <Button
              key={tab}
              className={clx(classes.button, {
                [classes.active]: tab === geoFilterType
              })}
              variant="contained"
              size="small"
              onClick={this.setTab.bind(null, tab)}
            >
              { tab }
            </Button>
        ))}
        </div> */}
        <div id="geocoder" className={classes.geocoder} />
      </div>
    );
  }
};

MapSearch.propTypes = {
  map: PropTypes.shape({}),
  councils: PropTypes.arrayOf(PropTypes.shape({})),
  onGeocoderResult: PropTypes.func,
  onChangeTab: PropTypes.func,
  onReset: PropTypes.func,
  canReset: PropTypes.bool,
};

MapSearch.defaultProps = {
  map: null,
  councils: [],
  onGeocoderResult: () => {},
  onChangeTab: () => {},
  onReset: () => {},
  canReset: false
};

export default withStyles(styles)(MapSearch);
