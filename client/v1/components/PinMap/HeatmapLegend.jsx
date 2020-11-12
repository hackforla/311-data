import React from 'react';
import PropTypes from 'proptypes';
import Control from 'react-leaflet-control';

const HeatmapLegend = ({
  visible,
  position,
}) => {
  if (visible) {
    return (
      <Control position={position}>
        <div className="heatmap-legend-wrapper has-text-centered">
          <div className="has-text-centered">
            Concentration of Reports
          </div>
          <div id="heatmap-gradient-legend" className="level columns">
            <span className="column has-text-left level-item">
              Low
            </span>
            <span className="column has-text-right level-item">
              High
            </span>
          </div>
        </div>
      </Control>
    );
  }
  return null;
};

HeatmapLegend.propTypes = {
  visible: PropTypes.bool.isRequired,
  position: PropTypes.oneOf(['topright', 'topleft', 'bottomright', 'bottomleft']),
};

HeatmapLegend.defaultProps = {
  position: 'bottomright',
};

export default HeatmapLegend;
