import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';

function ZoomTooltip({ show }) {
  return (
    <Tooltip
      placement="top-end"
      arrow
      open={show}
      title={(
        <div>
          <p>
            <strong>
              Zoom features are limited while locked into a
              neighborhood council.
            </strong>
            <br />
            To reset zoom features, please exit the boundary selection
            by clicking the 'X' on the selected Neighborhood Council
            within the 'Boundaries' filter of the 'Search & Filters'
            modal.
          </p>
        </div>
      )}
      //* changing styles here changes the color of the zoom control, not the tooltip
    >
      {/* empty span for positioning the zoomtooltip */}
      <span
        className="mapboxgl-ctrl-icon minus-sign-clone"
        // * changing styles here changes the color of the zoom control, not the tooltip
        // style={{ backgroundColor: '#29404f' }}
      />
    </Tooltip>
  );
}
ZoomTooltip.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default ZoomTooltip;
