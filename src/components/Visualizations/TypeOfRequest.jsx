import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import PieChart from './PieChart';

const TypeOfRequest = ({
  typeCounts,
}) => {
  const sectors = Object.keys(typeCounts).map(key => ({
    label: REQUEST_TYPES[key]?.displayName,
    value: typeCounts[key],
    color: REQUEST_TYPES[key]?.color,
  }));

  return (
    <PieChart
      id="type-of-request"
      title="Type of Request"
      sectors={sectors}
    />
  );
};

const mapStateToProps = state => ({
  typeCounts: state.data.counts.type,
});

export default connect(mapStateToProps)(TypeOfRequest);

TypeOfRequest.propTypes = {
  typeCounts: PropTypes.shape({}),
};

TypeOfRequest.defaultProps = {
  typeCounts: {},
};
