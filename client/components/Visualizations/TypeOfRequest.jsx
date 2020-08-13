import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import { PieChart } from '@components/Chart';

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
      title="Type of Request"
      titleInfo="This chart displays the relative frequency of each request type."
      sectors={sectors}
      componentName="TypeOfRequest"
      pdfTemplateName="VisPage"
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
