import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { updateNC } from '@reducers/filters';
import { updateComparisonList } from '@reducers/comparisonFilters';
import { COUNCILS } from '@components/common/CONSTANTS';
import MultiSelect from '@components/common/MultiSelect';

const NCSelector = ({
  selectedCouncils,
  updateSelectedCouncils,
}) => {
  const items = COUNCILS.map(council => ({
    ...council,
    selected: selectedCouncils.includes(council.name),
  }));

  const onChange = ({ items: changed, selected }) => {
    const names = changed.map(item => item.name);
    const newList = selected
      ? [...selectedCouncils, ...names]
      : selectedCouncils.filter(name => !names.includes(name));
    return updateSelectedCouncils(newList);
  };

  return (
    <MultiSelect
      items={items}
      onChange={onChange}
      groupBy="region"
      searchBar
      searchPlaceholder="Type Neighborhood Council"
      selectAll
    />
  );
};

const mapStateToProps = (state, ownProps) => ({
  selectedCouncils: ownProps.comparison
    ? state.comparisonFilters.comparison[ownProps.set].list
    : state.filters.councils,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateSelectedCouncils: ownProps.comparison
    ? councils => dispatch(updateComparisonList(ownProps.set, councils))
    : councils => dispatch(updateNC(councils)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NCSelector);

NCSelector.propTypes = {
  selectedCouncils: PropTypes.arrayOf(PropTypes.string),
  updateSelectedCouncils: PropTypes.func,
};

NCSelector.defaultProps = {
  selectedCouncils: [],
  updateSelectedCouncils: () => null,
};
