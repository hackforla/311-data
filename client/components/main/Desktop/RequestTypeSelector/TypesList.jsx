import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord'

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
    paddingTop: '5px',
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

// TODO: add counts to request types
const TypesList = ({
  onClick,
  items,
  selectedItems,
}) => {
  const classes = useStyles();

  const renderItems = () => (
    items.map(item => (
      <MenuItem
        key={item.typeName}
        className={classes.option}
        onClick={onClick}
        dense
        value={item.typeId}
        selected={selectedItems.some(({typeId}) => typeId === item.typeId)}
      >
        <FiberManualRecordIcon
          className={classes.icon}
          style={{ color: item.color }}
        />
        {item.typeName}
      </MenuItem>
    ))
  )

  return (
    <div className={classes.wrapper}>
      <div className={classes.innerWrapper}>
        {renderItems()}
      </div>
    </div>
  );
}

export default TypesList;

TypesList.propTypes = {
  onClick: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    typeId: PropTypes.number,
    typeName: PropTypes.string,
    color: PropTypes.string,
  })).isRequired,
};
