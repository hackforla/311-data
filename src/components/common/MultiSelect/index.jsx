import React, { useState } from 'react';
import PropTypes from 'proptypes';
import SearchBar from './SearchBar';
import SelectAllItem from './SelectAllItem';
import FlatMultiSelect from './FlatMultiSelect';
import FilteredMultiSelect from './FilteredMultiSelect';
import GroupedMultiSelect from './GroupedMultiSelect';

const MultiSelect = ({
  items,
  onChange,
  groupBy,
  searchBar,
  searchPlaceholder,
  selectAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="multi-select">
      { searchBar && (
        <SearchBar
          value={searchTerm}
          placeholder={searchPlaceholder}
          onChange={setSearchTerm}
        />
      )}
      <div className="multi-select-content">
        {
          searchTerm
            ? (
              <FilteredMultiSelect
                items={items}
                onChange={onChange}
                searchTerm={searchTerm}
              />
            ) : (
              <>
                { selectAll && (
                  <SelectAllItem
                    text="Select All/Deselect All"
                    bold
                    items={items}
                    onChange={onChange}
                  />
                )}
                {
                  groupBy
                    ? (
                      <GroupedMultiSelect
                        items={items}
                        onChange={onChange}
                        groupBy={groupBy}
                      />
                    ) : (
                      <FlatMultiSelect
                        items={items}
                        onChange={onChange}
                      />
                    )
                }
              </>
            )
        }
      </div>
    </div>
  );
};

export default MultiSelect;

MultiSelect.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    selected: PropTypes.bool,
  })),
  onChange: PropTypes.func,
  groupBy: PropTypes.string,
  searchBar: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  selectAll: PropTypes.bool,
};

MultiSelect.defaultProps = {
  items: [],
  onChange: () => null,
  groupBy: null,
  searchBar: false,
  searchPlaceholder: 'Search',
  selectAll: false,
};
