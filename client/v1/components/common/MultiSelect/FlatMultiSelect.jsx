import React from 'react';
import PropTypes from 'proptypes';
import SelectItem from './SelectItem';

const FlatMultiSelect = ({
  items,
  onChange,
}) => items.map(item => (
  <SelectItem
    key={item.id}
    text={item.name}
    status={item.selected ? 'selected' : 'unselected'}
    onClick={() => onChange({
      items: [item],
      selected: !item.selected,
    })}
  />
));

export default FlatMultiSelect;

FlatMultiSelect.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    selected: PropTypes.bool,
  })),
  onChange: PropTypes.func,
};

FlatMultiSelect.defaultProps = {
  items: [],
  onChange: () => null,
};
