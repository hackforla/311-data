import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { REQUEST_SOURCES } from '@components/common/CONSTANTS';
import PieChart from '@components/Chart/PieChart';

// if a source has less than this percentage of the total, it will be grouped
// into the "Other" category. This helps prevent the labels from overlapping.
const MIN_PERCENTAGE = 1.0;

const Contact311 = ({
  sourceCounts,
  exportable,
  hideTitle,
}) => {
  const sectors = (() => {
    if (Object.keys(sourceCounts).length === 0) return [];

    // reconstruct counts with "Other" category for small pie sectors
    const altCounts = {
      Other: 0,
    };

    const total = Object.values(sourceCounts).reduce((p, c) => p + c, 0);

    Object.keys(sourceCounts).forEach(key => {
      if (sourceCounts[key] / total >= MIN_PERCENTAGE / 100) {
        altCounts[key] = sourceCounts[key];
      } else {
        altCounts.Other += sourceCounts[key];
      }
    });

    // create sectors using altCounts
    return Object.keys(altCounts)
      .map(key => ({
        label: key,
        value: altCounts[key],
        color: REQUEST_SOURCES.find(s => s.type === key)?.color,
      }));
  })();

  return (
    <PieChart
      id="contact-311"
      title={hideTitle ? undefined : 'How People Contact 311'}
      sectors={sectors}
      addLabels
      exportable={exportable}
    />
  );
};

const mapStateToProps = (state, ownProps) => ({
  sourceCounts: ownProps.sourceCounts || state.data.counts.source,
});

export default connect(mapStateToProps)(Contact311);

Contact311.propTypes = {
  sourceCounts: PropTypes.shape({}),
  exportable: PropTypes.bool,
  hideTitle: PropTypes.bool,
};

Contact311.defaultProps = {
  sourceCounts: {},
  exportable: true,
  hideTitle: false,
};
