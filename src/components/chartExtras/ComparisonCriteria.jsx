import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { DISTRICT_TYPES, REQUEST_TYPES, COMPARISON_SETS } from '@components/common/CONSTANTS';
import CollapsibleList from '@components/common/CollapsibleList';
import InfoTitle from '@components/common/InfoTitle';

const ComparisonCriteria = ({
  startDate,
  endDate,
  sets,
  requestTypes,
}) => {
  // DATES //
  const dateText = startDate && endDate
    ? `From ${startDate} to ${endDate}`
    : 'No date range selected.';

  // DISTRICTS //
  const districtSelection = setId => {
    const set = sets[setId];

    if (!set.district) {
      return (
        <>
          <span className="criteria-type">
            District Selection
          </span>
          No districts selected.
        </>
      );
    }

    const { name } = DISTRICT_TYPES.find(t => set.district === t.id);
    const { name: setName } = COMPARISON_SETS[setId];
    return (
      <>
        <span className="criteria-type">
          { name }
          &nbsp;(
          { setName }
          )
        </span>
        <CollapsibleList
          items={set.list}
          maxShown={10}
          delimiter="; "
          buttonId={`toggle-show-more-${set.district}`}
          ifEmpty="None selected."
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

    if (selectedTypes.length === 0) return 'No types selected.';

    return (
      <>
        { selectedTypes.map((type, i) => (
          <span key={type.displayName}>
            { type.displayName }
            &nbsp;[
            <span style={{ color: type.color }}>{ type.abbrev }</span>
            ]
            { i < selectedTypes.length - 1 ? ';\u00a0' : '' }
          </span>
        ))}
      </>
    );
  })();

  return (
    <div className="chart-extra comparison-criteria">
      <InfoTitle
        title="Criteria"
        infoText="The legend displays the specific date range, districts and request type(s) selected by the user."
      />
      <div className="outline">
        <span className="criteria-type">
          Date Range
        </span>
        { dateText }
        { districtSelection('set1') }
        { districtSelection('set2') }
        <span className="criteria-type">
          Request Type Selection
        </span>
        { typeSelection }
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  startDate: state.comparisonFilters.startDate,
  endDate: state.comparisonFilters.endDate,
  sets: {
    set1: state.comparisonFilters.comparison.set1,
    set2: state.comparisonFilters.comparison.set2,
  },
  requestTypes: state.comparisonFilters.requestTypes,
});

export default connect(mapStateToProps)(ComparisonCriteria);

ComparisonCriteria.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  sets: PropTypes.shape({
    set1: PropTypes.shape({
      district: PropTypes.string,
      list: PropTypes.arrayOf(PropTypes.string),
    }),
    set2: PropTypes.shape({
      district: PropTypes.string,
      list: PropTypes.arrayOf(PropTypes.string),
    }),
  }).isRequired,
  requestTypes: PropTypes.shape({}).isRequired,
};

ComparisonCriteria.defaultProps = {
  startDate: undefined,
  endDate: undefined,
};
