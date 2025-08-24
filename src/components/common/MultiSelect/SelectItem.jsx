import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  selectItemTextWrap: {
    whiteSpace: 'normal',
  },
}));

function SelectItem({
  text, value, onClick, disabled,
}) {
  const classes = useStyles();
  return (
    <MenuItem
      className={classes.selectItemTextWrap}
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
}

export default SelectItem;

SelectItem.propTypes = {
  text: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

SelectItem.defaultProps = {
  text: '',
  disabled: false,
};
