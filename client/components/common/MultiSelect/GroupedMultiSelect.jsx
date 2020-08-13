import React from 'react';
import PropTypes from 'proptypes';
import SelectGroup from './SelectGroup';

const GroupedMultiSelect = ({
  items,
  onChange,
  groupBy,
}) => {
  const groups = items.reduce((acc, item) => ({
    ...acc,
    [item[groupBy]]: [...(acc[item[groupBy]] || []), item],
  }), {});

  return Object.keys(groups).map(name => (
    <SelectGroup
      key={name}
      name={name}
      items={groups[name]}
      onChange={onChange}
    />
  ));
};

export default GroupedMultiSelect;

GroupedMultiSelect.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    selected: PropTypes.bool,
  })),
  onChange: PropTypes.func,
  groupBy: PropTypes.string.isRequired,
};

GroupedMultiSelect.defaultProps = {
  items: [],
  onChange: () => null,
};
