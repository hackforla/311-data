import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import SnapshotService from '@components/export/SnapshotService';
import ComparisonCriteria from '@components/chartExtras/ComparisonCriteria';
import ComparisonLegend from '@components/chartExtras/ComparisonLegend';
import VisualizationsPlaceholder from '@components/Visualizations/VisualizationsPlaceholder';
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
  chartsVisibility,
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

  if (chartsVisibility) {
    return (
      <div className="comparison">
        <ComparisonCriteria />
        { chartType !== 'contact' && <ComparisonLegend /> }
        { chart }
      </div>
    );
  }

  return <VisualizationsPlaceholder />;
};

const mapStateToProps = state => ({
  chartType: state.comparisonData.chart,
  chartsVisibility: state.ui.showComparisonCharts,
});

export default connect(mapStateToProps)(Comparison);

Comparison.propTypes = {
  chartType: PropTypes.string,
  chartsVisibility: PropTypes.bool.isRequired,
};

Comparison.defaultProps = {
  chartType: undefined,
};
