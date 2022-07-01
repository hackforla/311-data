/* eslint-disable */

import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { getDataRequestSuccess } from '@reducers/data';
import { updateMapPosition } from '@reducers/ui';
import { trackMapExport } from '@reducers/analytics';
import CookieNotice from '../main/CookieNotice';
// import { MAP_MODES } from '../common/CONSTANTS';
// import "mapbox-gl/dist/mapbox-gl.css";
import Map from './Map';

const styles = theme => ({
  root: {
    height: `calc(100vh - ${theme.header.height} - ${theme.footer.height})`,
  },
})

class MapContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ncCounts: null,
      ccCounts: null,
      position: props.position,
      lastUpdated: props.lastUpdated,
      selectedTypes: this.getSelectedTypes(),
    }

    this.isSubscribed = null;
  }

  componentDidMount() {
    this.isSubscribed = true;
    this.setData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeMode !== this.props.activeMode ||
      prevProps.pins !== this.props.pins)
      this.setData();
  }

  componentWillUnmount() {
    this.isSubscribed = false;
  }

  getOpenRequests = async () => {
    // TODO: add date specification. See https://dev-api.311-data.org/docs#/default/get_all_service_requests_requests_get.
    const url = `${process.env.API_URL}/requests`;
    const { data } = await axios.get(url);
    this.openRequests = data;
  };

  setData = async () => {
    const { pins } = this.props;

    if (!this.openRequests) {
      await this.getOpenRequests();
    }

    if (this.isSubscribed) {
      const { getDataSuccess } = this.props;
      getDataSuccess(this.convertRequests(this.openRequests));
    }
  };

  convertRequests = requests => ({
    type: 'FeatureCollection',
    features: requests.map(request => ({
      type: 'Feature',
      properties: {
        requestId: request.requestId,
        typeId: request.typeId,
        closedDate: request.closedDate,
      },
      geometry: {
        type: 'Point',
        coordinates: [
          request.longitude,
          request.latitude,
        ]
      }
    }))
  });

  // TODO: fix this
  getSelectedTypes = () => {
    const { requestTypes } = this.props;
    // return Object.keys(requestTypes).filter(type => {
    //   return type !== 'All' && requestTypes[type]
    // });
    return requestTypes;
  };

  render() {
    const { position, lastUpdated, updatePosition, exportMap, classes, requests } = this.props;
    const { ncCounts, ccCounts, selectedTypes } = this.state;
    return (
      <div className={classes.root}>
        <Map
          requests={requests}
          ncCounts={ncCounts}
          ccCounts={ccCounts}
          position={position}
          lastUpdated={lastUpdated}
          updatePosition={updatePosition}
          exportMap={exportMap}
          selectedTypes={selectedTypes}
        />
        <CookieNotice />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  pins: state.data.pins,
  position: state.ui.map,
  lastUpdated: state.metadata.lastPulledLocal,
  activeMode: state.ui.map.activeMode,
  requestTypes: state.filters.requestTypes,
  requests: state.data.requests
});

const mapDispatchToProps = dispatch => ({
  updatePosition: position => dispatch(updateMapPosition(position)),
  exportMap: () => dispatch(trackMapExport()),
  getDataSuccess: data => dispatch(getDataRequestSuccess(data)),
});

MapContainer.propTypes = {};

MapContainer.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MapContainer));
