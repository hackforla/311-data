import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import CollapsibleText from './CollapsibleText';

const ComparisonCriteria = ({
  startDate,
  endDate,
  set1,
  set2,
  requestTypes,
}) => {
  const dateText = startDate && endDate
    ? `From ${startDate} to ${endDate}`
    : 'No date range selected.';

  return (
    <div className="chart-extra comparison-criteria">
      <h1>Criteria</h1>
      <div className="outline">
        <div className="date-range">
          <span className="criteria-type">
            Date Range
          </span>
          { dateText }
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  startDate: state.comparisonFilters.startDate,
  endDate: state.comparisonFilters.endDate,
  set1: state.comparisonFilters.comparison.set1,
  set2: state.comparisonFilters.comparison.set2,
  requestTypes: state.comparisonFilters.requestTypes,
});

export default connect(mapStateToProps)(ComparisonCriteria);

ComparisonCriteria.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  set1: PropTypes.shape({
    district: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  set2: PropTypes.shape({
    district: PropTypes.string,
    list: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  requestTypes: PropTypes.shape({}).isRequired,
};

ComparisonCriteria.defaultProps = {
  startDate: undefined,
  endDate: undefined,
};
