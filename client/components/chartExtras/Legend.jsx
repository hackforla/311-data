import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import InfoTitle from '@components/common/InfoTitle';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';

const Legend = ({
  requestTypes,
}) => {
  const selectedTypes = (
    Object.keys(requestTypes)
      .filter(type => type !== 'All' && requestTypes[type])
      .map(type => REQUEST_TYPES[type])
  );

  return (
    <div className="chart-extra legend">
      <InfoTitle
        title="Legend"
        infoText="The legend displays the specific 311 request types selected by the user."
      />
      <div className="outline">
        {
          selectedTypes.length > 0
            ? selectedTypes.map(({ displayName, color, abbrev }) => (
              <span key={abbrev} className="legend-item">
                <div
                  className="circle"
                  style={{ backgroundColor: color }}
                />
                { displayName }
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
