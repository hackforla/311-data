import React from 'react';
import PropTypes from 'proptypes';
// import { createPortal } from 'react-dom';

const HeatmapLegend = ({
  // visible,
}) => {
  // if (visible) {
  return (
    <div className="heatmap-legend-wrapper has-text-centered">
      Concentration of Reports (Heatmap)
      <div id="heatmap-gradient-legend" className="level">
        <span className="level-left">
          Low
        </span>
        <span className="level-right">
          High
        </span>
      </div>
    </div>
  );
  // }
  // return null;
};

// HeatmapLegend.propTypes = {
//   visible: PropTypes.bool.isRequired,
// };

// export default createPortal(HeatmapLegend, 'leaflet-bottom leaflet-right');
export default HeatmapLegend;
