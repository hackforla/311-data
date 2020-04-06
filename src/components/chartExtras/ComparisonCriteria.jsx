import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { DISTRICT_TYPES, REQUEST_TYPES } from '@components/common/CONSTANTS';
import CollapsibleText from './CollapsibleText';

const ComparisonCriteria = ({
  startDate,
  endDate,
  set1,
  set2,
  requestTypes,
}) => {
  // DATES //
  const dateText = startDate && endDate
    ? `From ${startDate} to ${endDate}`
    : 'No date range selected.';

  // DISTRICTS //
  const districtSelection = set => {
    if (!set.district) return null;

    const { name } = DISTRICT_TYPES.find(t => set.district === t.id);
    return (
      <>
        <span className="criteria-type">
          { name }
        </span>
        <CollapsibleText
          items={set.list}
          maxShown={10}
          delimiter="; "
          buttonId="toggle-show-more"
        />
      </>
    );
  };

  // REQUEST TYPES //
  const typeSelection = (() => {
    const selectedTypes = (
      Object.keys(requestTypes)
        .filter(type => type !== 'All' && requestTypes[type])
        .map(type => REQUEST_TYPES[type])
    );

    if (selectedTypes.length === 0) return null;

    return (
      <>
        <span className="criteria-type">
          Request Type Selection
        </span>
        { selectedTypes.map(type => (
          <span key={type.displayName}>
            { type.displayName }
            &nbsp;[
            <span style={{ color: type.color }}>{ type.abbrev }</span>
            ];&nbsp;
          </span>
        ))}
      </>
    );
  })();

  return (
    <div className="chart-extra comparison-criteria">
      <h1>Criteria</h1>
      <div className="outline">
        <span className="criteria-type">
          Date Range
        </span>
        { dateText }
        { districtSelection(set1) }
        { districtSelection(set2) }
        { typeSelection }
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
