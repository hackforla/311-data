import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { REQUEST_SOURCES } from '@components/common/CONSTANTS';
import { PieChart } from '@components/Chart';
import { transformCounts } from '@utils';

const Contact311 = ({
  sourceCounts,
}) => {
  const altCounts = transformCounts(sourceCounts);

  const sectors = Object.keys(altCounts)
    .map(key => {
      const source = REQUEST_SOURCES.find(s => s.type === key);
      return {
        label: key,
        value: altCounts[key],
        color: source?.color,
        abbrev: source?.abbrev,
      };
    });

  return (
    <PieChart
      title="How People Contact 311"
      titleInfo="This chart displays the relative frequency of methods people use to contact 311."
      sectors={sectors}
      addLabels
      componentName="Contact311"
      pdfTemplateName="VisPageNoLegend"
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
