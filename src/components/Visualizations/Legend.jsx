import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';

const Legend = ({
  requestTypes,
}) => {
  const selectedTypes = REQUEST_TYPES.filter(el => requestTypes[el.type]);

  return (
    <div className="legend">
      <h1 className="has-text-centered">Legend</h1>
      <div className="outline">
        {
          selectedTypes.length > 0
            ? selectedTypes.map(({ type, color, abbrev }) => (
              <span key={abbrev} className="legend-item">
                <div
                  className="circle"
                  style={{ backgroundColor: color }}
                />
                { type }
                {' '}
                [
                <span style={{ color }}>{abbrev}</span>
                ]
              </span>
            ))
            : (
              <span className="legend-item">
                No request types selected.
              </span>
            )
        }
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  requestTypes: state.filters.requestTypes,
});

export default connect(mapStateToProps)(Legend);

Legend.propTypes = {
  requestTypes: PropTypes.shape({}).isRequired,
};
