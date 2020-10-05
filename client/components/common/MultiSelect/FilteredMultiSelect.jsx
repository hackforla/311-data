import React from 'react';
import PropTypes from 'proptypes';
import FlatMultiSelect from './FlatMultiSelect';

const FilteredMultiSelect = ({
  items,
  onChange,
  searchTerm,
}) => {
  const searchFilter = new RegExp(searchTerm, 'i');
  const filteredItems = items.filter(item => searchFilter.test(item.name));

  return filteredItems.length > 0
    ? (
      <FlatMultiSelect
        items={filteredItems}
        onChange={onChange}
      />
    ) : (
      <span>No matches for your search term.</span>
    );
};

export default FilteredMultiSelect;

FilteredMultiSelect.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    selected: PropTypes.bool,
  })),
  onChange: PropTypes.func,
  searchTerm: PropTypes.string,
};

FilteredMultiSelect.defaultProps = {
  items: [],
  onChange: () => null,
  searchTerm: '',
};
