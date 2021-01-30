import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
  label: {
    fontFamily: 'Roboto',
    color: theme.palette.secondary.light,
  },
  deleteIcon: {
    color: theme.palette.secondary.light,
  },
}));

const SolidChip = ({
  typeName,
  typeId,
  color,
  onDelete,
}) => {
  const classes = useStyles();

  return (
    <Chip
      classes={{
        label: classes.label,
        deleteIcon: classes.deleteIcon,
      }}
      // variant="outlined"
      label={typeName}
      onDelete={onDelete}
      deleteIcon={<CloseIcon data-id={typeId} />}
      size="small"
      style={{ backgroundColor: color }}
    />
  );
};

export default SolidChip;
