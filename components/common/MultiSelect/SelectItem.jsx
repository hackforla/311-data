import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';

const SelectItem = ({
  text,
  value,
  onClick,
  disabled,
}) => (
  <MenuItem
    key={text}
    onClick={onClick}
    dense
    value={value}
    disableRipple
    disabled={disabled}
    aria-label={text}
  >
    {text}
  </MenuItem>
);

export default SelectItem;

SelectItem.propTypes = {
  text: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

SelectItem.defaultProps = {
  text: '',
  disabled: false,
};
