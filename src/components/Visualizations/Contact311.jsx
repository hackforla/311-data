import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { REQUEST_SOURCES } from '@components/common/CONSTANTS';
import PieChart from './PieChart';

const Contact311 = ({
  sourceCounts,
}) => {
  const sectors = Object.keys(sourceCounts).map(key => ({
    label: key,
    value: sourceCounts[key],
    color: REQUEST_SOURCES.find(s => s.type === key)?.color,
  }));

  return (
    <PieChart
      id="contact-311"
      title="How People Contact 311"
      sectors={sectors}
      addLabels
    />
  );
};

const mapStateToProps = state => ({
  sourceCounts: state.data.counts.source,
});

export default connect(mapStateToProps)(Contact311);

Contact311.propTypes = {
  sourceCounts: PropTypes.shape({}),
};

Contact311.defaultProps = {
  sourceCounts: {},
};
