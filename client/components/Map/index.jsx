  
import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { updateMapPosition } from '@reducers/ui';
import { trackMapExport } from '@reducers/analytics';
import { MAP_MODES } from '../common/CONSTANTS';
import Map from './Map';

const styles = theme => ({
  root: {
    position: 'absolute',
    top: theme.palette.header.height,
    bottom: theme.palette.footer.height,
    left: 0,
    right: 0,
  },
})

class MapContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      requests: this.convertRequests([]),
      ncCounts: null,
      ccCounts: null,
      position: props.position,
      lastUpdated: props.lastUpdated,
      selectedTypes: this.getSelectedTypes(),
    }

    this.openRequests = null;
  }

  componentDidMount() {
    // TODO: redux-saga, add to store instead of local state
    this.setData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeMode !== this.props.activeMode ||
        prevProps.pins !== this.props.pins)
      this.setData();

    if (prevProps.requestTypes !== this.props.requestTypes)
      this.setState({ selectedTypes: this.getSelectedTypes() });
  }

  getOpenRequests = async () => {
    const url = `${process.env.API_URL}/open-requests`;
    const { data } = await axios.post(url);
    this.openRequests = data;
  };

  setData = async () => {
    const { activeMode, pins } = this.props;
    switch(activeMode) {
      case MAP_MODES.OPEN:
        if (!this.openRequests)
          await this.getOpenRequests()

        return this.setState({
          requests: this.convertRequests(this.openRequests.requests),
          ncCounts: this.openRequests.counts.nc,
          ccCounts: this.openRequests.counts.cc,
        });
      case MAP_MODES.CLOSED:
        return this.setState({
          requests: this.convertRequests(pins),
          ncCounts: null,
          ccCounts: null,
        });
    }
  };

  convertRequests = requests => ({
    type: 'FeatureCollection',
    features: requests.map(request => ({
      type: 'Feature',
      properties: {
        id: request.srnumber,
        type: request.requesttype,
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

  getSelectedTypes = () => {
    const { requestTypes } = this.props;
    return Object.keys(requestTypes).filter(type => {
      return type !== 'All' && requestTypes[type]
    });
  };

  render() {
    const { position, lastUpdated, updatePosition, exportMap, classes } = this.props;
    const { requests, ncCounts, ccCounts, selectedTypes } = this.state;
    return (
      <div className={classes.root}>
        <Map
          requests={requests}
          // ncCounts={ncCounts}
          // ccCounts={ccCounts}
          position={position}
          // lastUpdated={lastUpdated}
          // updatePosition={updatePosition}
          // exportMap={exportMap}
          selectedTypes={selectedTypes}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  pins: state.data.pins,
  position: state.ui.map,
  lastUpdated: state.metadata.lastPulled,
  activeMode: state.ui.map.activeMode,
  requestTypes: state.mapFilters.requestTypes,
});

const mapDispatchToProps = dispatch => ({
  updatePosition: position => dispatch(updateMapPosition(position)),
  exportMap: () => dispatch(trackMapExport()),
});

MapContainer.propTypes = {};

MapContainer.defaultProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MapContainer));
