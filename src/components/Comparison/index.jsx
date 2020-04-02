import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';

import TimeToCloseComparison from './TimeToCloseComparison';
import FrequencyComparison from './FrequencyComparison';
import TotalRequestsComparison from './TotalRequestsComparison';
import Contact311Comparison from './Contact311Comparison';

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
