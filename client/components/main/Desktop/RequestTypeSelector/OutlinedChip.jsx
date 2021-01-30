import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  label: {
    fontFamily: 'Roboto',
    // fontWeight: 'bold',
    color: props => props.color,
  },
  deleteIcon: {
    // fontWeight: 'bold',
    color: props => props.color,
  },
  outlined: {
    borderColor: props => props.color,
  }
}));

const OutlinedChip = ({
  typeName,
  typeId,
  color,
  onDelete,
}) => {
  const classes = useStyles({typeName, typeId, color, onDelete});

  return (
    <Chip
      classes={{
        label: classes.label,
        deleteIcon: classes.deleteIcon,
        outlined: classes.outlined,
      }}
      variant="outlined"
      label={typeName}
      onDelete={onDelete}
      deleteIcon={<CloseIcon data-id={typeId} />}
      size="small"
      // style={{ backgroundColor: color }}
    />
  );
};

export default OutlinedChip;