import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { DISTRICT_TYPES } from '@components/common/CONSTANTS';
import ChartExportSelect from '@components/export/ChartExportSelect';
import Contact311 from './Contact311';

const Contact311Comparison = ({
  counts: { set1, set2 },
}) => {
  const setName = district => (
    DISTRICT_TYPES
      .find(t => t.id === district)?.name
      .replace(' District', '')
  );

  return (
    <div className="contact-311-comparison">
      <h1>How People Contact 311</h1>
      <ChartExportSelect />
      <div className="chart-container">
        <Contact311
          sourceCounts={set1.source}
          exportable={false}
          hideTitle
        />
        <h2>{ setName(set1.district) }</h2>
      </div>
      <div className="chart-container">
        <Contact311
          sourceCounts={set2.source}
          exportable={false}
          hideTitle
        />
        <h2>{ setName(set2.district) }</h2>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  counts: state.comparisonData.counts,
});

export default connect(mapStateToProps)(Contact311Comparison);

Contact311Comparison.propTypes = {
  counts: PropTypes.shape({
    set1: PropTypes.shape({
      district: PropTypes.string,
      source: PropTypes.shape({}),
    }),
    set2: PropTypes.shape({
      district: PropTypes.string,
      source: PropTypes.shape({}),
    }),
  }),
};

Contact311Comparison.defaultProps = {
  counts: {
    set1: {},
    set2: {},
  },
};
