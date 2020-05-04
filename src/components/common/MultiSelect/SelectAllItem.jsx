import React from 'react';
import PropTypes from 'proptypes';
import SelectItem from './SelectItem';

const SelectAllItem = ({
  text,
  bold,
  items,
  onChange,
}) => {
  const numSelected = items.filter(item => item.selected).length;

  return (
    <SelectItem
      text={text}
      bold={bold}
      status={(() => {
        switch (numSelected) {
          case 0: return 'unselected';
          case items.length: return 'selected';
          default: return 'indeterminate';
        }
      })()}
      onClick={() => onChange({
        items,
        selected: numSelected === 0,
      })}
    />
  );
};

export default SelectAllItem;

SelectAllItem.propTypes = {
  text: PropTypes.string,
  bold: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  onChange: PropTypes.func,
};

SelectAllItem.defaultProps = {
  text: '',
  bold: false,
  items: [],
  onChange: () => null,
};
