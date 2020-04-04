import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import SnapshotService from '@components/export/SnapshotService';
import ComparisonCriteria from '@components/chartExtras/ComparisonCriteria';
import ComparisonLegend from '@components/chartExtras/ComparisonLegend';
import TimeToCloseComparison from './TimeToCloseComparison';
import FrequencyComparison from './FrequencyComparison';
import TotalRequestsComparison from './TotalRequestsComparison';
import Contact311Comparison from './Contact311Comparison';

SnapshotService.register({
  TimeToCloseComparison,
  FrequencyComparison,
  TotalRequestsComparison,
  Contact311Comparison,
});

const Comparison = ({
  chartType,
}) => {
  const chart = (() => {
    switch (chartType) {
      case 'time': return <TimeToCloseComparison />;
      case 'frequency': return <FrequencyComparison />;
      case 'request': return <TotalRequestsComparison />;
      case 'contact': return <Contact311Comparison />;
      default: return null;
    }
  })();

  return (
    <div className="comparison">
      <ComparisonCriteria />
      { chartType !== 'contact' && <ComparisonLegend /> }
      { chart }
    </div>
  );
};

const mapStateToProps = state => ({
  chartType: state.comparisonData.chart,
});

export default connect(mapStateToProps)(Comparison);

Comparison.propTypes = {
  chartType: PropTypes.string,
};

Comparison.defaultProps = {
  chartType: undefined,
};
