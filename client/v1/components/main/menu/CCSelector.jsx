import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { updateComparisonList } from '@reducers/comparisonFilters';
import { CITY_COUNCILS } from '@components/common/CONSTANTS';
import MultiSelect from '@components/common/MultiSelect';

const CCSelector = ({
  selectedCouncils,
  updateSelectedCouncils,
}) => {
  const items = CITY_COUNCILS.map(council => ({
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
      searchBar
      searchPlaceholder="Type City Council District"
      selectAll
    />
  );
};

const mapStateToProps = (state, ownProps) => ({
  selectedCouncils: state.comparisonFilters.comparison[ownProps.set].list,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  updateSelectedCouncils: councils => dispatch(updateComparisonList(ownProps.set, councils)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CCSelector);

CCSelector.propTypes = {
  selectedCouncils: PropTypes.arrayOf(PropTypes.string),
  updateSelectedCouncils: PropTypes.func,
};

CCSelector.defaultProps = {
  selectedCouncils: [],
  updateSelectedCouncils: () => null,
};
