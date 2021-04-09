/* eslint-disable */

import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { GEO_FILTER_TYPES } from '../constants';

const TABS = Object.values(GEO_FILTER_TYPES);

const styles = theme => ({
  geocoder: {
    width: 325,
    backgroundColor: theme.palette.primary.dark,
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
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
});

class MapSearch extends React.Component {
  componentDidMount() {
    const { map } = this.props;

    this.geocoder = new MapboxGeocoder({
      accessToken: process.env.MAPBOX_TOKEN,
      flyTo: false,
      marker: false,
      minLength: 1,
      placeholder: 'Search address',
      // Need to implement localGeocoder
      localGeocoder: () => {}
    });

    this.geocoder.on('result', ({ result }) => {
      this.props.onGeocoderResult({ result });
      this.geocoder.clear();
    });

    document.getElementById('geocoder').appendChild(this.geocoder.onAdd(map));
  }

  render() {
    const { classes } = this.props;
    return (
      <div id="geocoder" className={classes.geocoder} />
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
