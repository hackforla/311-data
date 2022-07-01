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

const REQUEST_BATCH_SIZE = 5000;

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

    // We store the raw requests from the API call here, but eventually they are
    // converted and stored in the Redux store.
    this.rawRequests = null;
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

  getAllRequests = async () => {
    // TODO: add date specification. See https://dev-api.311-data.org/docs#/default/get_all_service_requests_requests_get.
    const url = new URL(`${process.env.API_URL}/requests`);
    url.searchParams.append("limit", `${REQUEST_BATCH_SIZE}`);
    console.log(url);
    const { data } = await axios.get(url);
    this.rawRequests = data;
  };

  setData = async () => {
    const { pins } = this.props;

    if (!this.rawRequests) {
      await this.getAllRequests();
    }

    if (this.isSubscribed) {
      const { getDataSuccess } = this.props;
      getDataSuccess(this.convertRequests(this.rawRequests));
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
