/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { GEO_FILTER_TYPES } from '../constants';
import settings from '@settings'
import { margin } from '@mui/system';

const TABS = Object.values(GEO_FILTER_TYPES);

const styles = theme => ({
  geocoder: {
    width: 300,
    backgroundColor: theme.palette.primary.dark,
    borderTopRightRadius: '5px',
    borderTopLeftRadius: '5px',
    borderBottomRightRadius: '5px',
    borderBottomLeftRadius: '5px',
    margin: '10px 5px 5px 0px',
    padding: '2px',
    '& div.mapboxgl-ctrl': {
      width: '100%',
      borderRadius: 0,
      borderBottom: 'none', 
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
  header: {
      fontSize: '12.47px',
      fontWeight: theme.typography.fontWeightMedium,
      marginBottom: '8px',
      marginTop: '12px'
  }
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
      accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
      flyTo: false,
      marker: false,
      minLength: 1,
      placeholder: "Search Address",
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
      filter: (item) => {
        // Early return if item is undefined
        if (item?.context === undefined || item.context.length === 0) return;
        // Return only places that are in los angeles county as district, this can be adjusted to include more places
        return item.context.some( (i) => {
          return (i.id.split(".").shift() === 'district' && i.text === "Los Angeles County");
        });
      }
    });

    // This event fires upon an Address Search submission
    this.geocoder.on('result', ({ result }) => {
      // this.props.onGeocoderResult({ result }); Temp: Do not trigger for blank map implementation
      
      // Blank Map Implementation: pass result to FilterMenu
      const selectedAddress = result.place_name;
      console.log("MapSearch - Selected address:", selectedAddress);
      this.props.onGeocoderResult(result);

      // This clears the address from the Address input field.
      // this.geocoder.clear(); 
    });

    const geocoderElement = document.getElementById('geocoder')
    geocoderElement.appendChild(this.geocoder.onAdd(map));

    // Add a custom event listener to clear the Address Search Input field
    this.addListener(geocoderElement, settings.map.eventName.reset, ()=>this.geocoder.clear() )
 
    //Listens to event when search address bar is cleared
    this.geocoder.on('clear', (result) => {
      console.log("Clear event triggered");
      //Updates props.onGeocoderResult with an empty string and handles empty string value in FilterMenu for Blank Map Form Validation
      this.props.onGeocoderResult({place_name: ''});
    });
    
    // this.setTab(GEO_FILTER_TYPES.address);
  }

  componentWillUnmount() {
    // Free memory and remove all event listeners
    const geocoderElement = document.getElementById('geocoder')
    this.removeListeners(geocoderElement, settings.map.eventName.reset)
  }

  setTab = tab => {
    this.props.onChangeTab(tab);
    // this.geocoder.clear();
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
         <Typography className={classes.header} style={{ color: this.props.hasError ? '#DE2800' : 'inherit' }}>Search by Address</Typography>
        <div id="geocoder" className={classes.geocoder} style={{ border: this.props.hasError ? '1.3px solid #DE2800': undefined, borderRadius: '5px' }}/>
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
  hasError: PropTypes.bool,
};

MapSearch.defaultProps = {
  map: null,
  councils: [],
  onGeocoderResult: () => {},
  onChangeTab: () => {},
  onReset: () => {},
  canReset: false,
  hasError: false,
};

export default withStyles(styles)(MapSearch);
