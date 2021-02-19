import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import CloseIcon from '@material-ui/icons/Close';

const useStylesSolid = makeStyles(theme => ({
  root: {
    backgroundColor: props => props.color,
  },
  label: {
    fontFamily: 'Roboto',
    color: theme.palette.secondary.light,
  },
  deleteIcon: {
    color: theme.palette.secondary.light,
  },
}));

const useStylesOutlined = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.secondary.light,
  },
  outlined: {
    borderColor: props => props.color,
  },
  label: {
    fontFamily: 'Roboto',
    color: theme.palette.text.primaryDark,
  },
  deleteIcon: {
    color: theme.palette.text.primaryDark,
    '&:hover': {
      color: theme.palette.secondary.main,
    },
  },
}));

const StyledChip = ({
  label,
  value,
  color,
  onDelete,
  outlined,
}) => {
  const classesSolid = useStylesSolid({ color });
  const classesOutlined = useStylesOutlined({ color });

  return (
    <Chip
      classes={outlined ? classesOutlined : classesSolid}
      label={label}
      onDelete={onDelete}
      deleteIcon={<CloseIcon data-id={value} />}
      size="small"
      variant={outlined ? 'outlined' : 'default'}
      clickable={false}
    />
  );
};

export default StyledChip;

StyledChip.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  color: PropTypes.string,
  onDelete: PropTypes.func,
  outlined: PropTypes.bool,
};

StyledChip.defaultProps = {
  value: undefined,
  color: undefined,
  onDelete: undefined,
  outlined: false,
};
