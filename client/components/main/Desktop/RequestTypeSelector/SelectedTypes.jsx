import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: 'Roboto',
    display: 'flex',
    flexWrap: 'wrap',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  placeholder: {
    font: theme.typography.b2,
    color: '#818181',
  },
  chipWrapper: {
    padding: 2,
  },
  label: {
    fontFamily: 'Roboto',
    color: theme.palette.secondary.light,
  },
  deleteIcon: {
    color: theme.palette.secondary.light,
  },
}));

const SelectedTypes = ({
  items,
  onDelete,
}) => {
  const classes = useStyles();

  const renderSelected = () => (
    items.map(item => (
      <li
        key={item.typeName}
        className={classes.chipWrapper}
      >
        <Chip
          classes={{
            label: classes.label,
            deleteIcon: classes.deleteIcon,
          }}  
          label={item.typeName}
          onDelete={onDelete}
          deleteIcon={<CloseIcon data-id={item.typeId}/>}
          size="small"
          style={{ backgroundColor: item.color }}
        />
      </li>
    ))
  )

  const renderSwitch = items => {
    switch(items.length) {
      case 0:
        return <span className={classes.placeholder}>Select request types</span>;
      default:
        return renderSelected();
    }
  }

  return (
    <Box className={classes.root} component="ul">
      {renderSwitch(items)}
    </Box>
  );
}

export default SelectedTypes;

SelectedTypes.propTypes = {
  onDelete: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    typeId: PropTypes.number,
    typeName: PropTypes.string,
    color: PropTypes.string,
  })).isRequired,
};
