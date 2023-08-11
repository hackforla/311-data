import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import Control from 'react-leaflet-control';
import Icon from '@components/common/Icon';

import { REQUEST_TYPES } from '@components/common/CONSTANTS';

const ExportLegend = ({
  requestTypes,
  visible,
  position,
}) => {
  const getRequestTypeFilters = Object.keys(requestTypes).filter(type => type !== 'All' && requestTypes[type]);
  const renderLegendTypes = getRequestTypeFilters.map(req => {
    const { color, displayName, abbrev } = REQUEST_TYPES[req];
    return (
      <div key={`export-legend-${abbrev}`}>
        <Icon
          id={`request-icon-${abbrev}`}
          icon="circle"
          size="small"
          style={{ color }}
        />
        {`${displayName} [${abbrev}]`}
      </div>
    );
  });

  if (visible) {
    return (
      <Control position={position}>
        <div className="export-legend-wrapper">
          <div className="export-legend-title">Request Type Legend:</div>
          <div className="leaflet-control-layers-separator" />
          {
            renderLegendTypes.length ? renderLegendTypes : 'No request types selected'
          }
        </div>
      </Control>
    );
  }
  return null;
};

const mapStateToProps = state => ({
  requestTypes: state.filters.requestTypes,
});

ExportLegend.propTypes = {
  requestTypes: PropTypes.shape({}).isRequired,
  visible: PropTypes.bool.isRequired,
  position: PropTypes.oneOf(['topright', 'topleft', 'bottomright', 'bottomleft']),
};

ExportLegend.defaultProps = {
  position: 'bottomright',
};

export default connect(mapStateToProps, null)(ExportLegend);
