import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles(theme => ({
  wrapper: {
    maxHeight: 190,
    overflowY: 'auto',
    margin: '-10px',
    // Firefox scrollbar
    scrollbarColor: '#616161 #818181',
    scrollbarWidth: 'thin',
    // Chrome/Safari/Edge/Opera scrollbar
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#818181',
      borderRadius: '0 5px 5px 0',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#616161',
      borderRadius: 20,
      height: 50,
    },
  },
  innerWrapper: {
    padding: '5px 0',
  },
  option: {
    fontFamily: 'Roboto',
    paddingLeft: 10,
    paddingBottom: 3,
    paddingTop: 3,
  },
  icon: {
    marginRight: theme.spacing(1),
  },
}));

const TypesList = ({
  items,
  selected,
  onClick,
}) => {
  const classes = useStyles();

  const renderOptions = ({ options, disabled = false }) => (
    options.map(option => (
      <MenuItem
        key={option.typeName}
        className={classes.option}
        onClick={onClick}
        dense
        value={option.typeId}
        disableRipple
        disabled={disabled}
      >
        <FiberManualRecordIcon
          className={classes.icon}
          style={{ color: option.color }}
        />
        {option.typeName}
      </MenuItem>
    ))
  );

  return (
    <div className={classes.wrapper}>
      <div className={classes.innerWrapper}>
        {renderOptions({ options: items, disabled: false })}
        {renderOptions({ options: selected, disabled: true })}
      </div>
    </div>
  );
};

export default TypesList;

TypesList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    typeId: PropTypes.number,
    typeName: PropTypes.string,
    color: PropTypes.string,
  })).isRequired,
  selected: PropTypes.arrayOf(PropTypes.shape({
    typeId: PropTypes.number,
    typeName: PropTypes.string,
    color: PropTypes.string,
  })).isRequired,
  onClick: PropTypes.func.isRequired,
};
