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
import { DATE_SPEC } from '../common/CONSTANTS';
// import "mapbox-gl/dist/mapbox-gl.css";
import Map from './Map';
import moment from 'moment';

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
    this.rawRequests = [];
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
  /**
   * Gets all requests over the time range specified in the Redux store.
   * 
   * Since the server is slow to retrieve all the requests at once, we need to
   * make multiple API calls, using `skip` and `limit` to retrieve consecutive
   * chunks of data.
   */
  getAllRequests = async () => {
    const { startDate, endDate } = this.props;
    const url = new URL(`${process.env.API_URL}/requests`);
    url.searchParams.append("start_date", moment(startDate, DATE_SPEC).format('YYYY-MM-DD'));
    url.searchParams.append("end_date", moment(endDate, DATE_SPEC).format('YYYY-MM-DD'));
    url.searchParams.append("limit", `${REQUEST_BATCH_SIZE}`);
    var returned_length = REQUEST_BATCH_SIZE;
    var skip = 0;
    while (returned_length === REQUEST_BATCH_SIZE) {
      url.searchParams.append("skip", `${skip}`);
      const { data } = await axios.get(url);
      returned_length = data.length;
      skip += returned_length;
      this.rawRequests.push(...data);
      url.searchParams.delete("skip");
    }
  };

  setData = async () => {
    const { pins } = this.props;

    if (this.rawRequests.length === 0) {
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
  startDate: state.filters.startDate,
  endDate: state.filters.endDate,
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
