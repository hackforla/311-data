import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/styles/';

const useStylesSolid = makeStyles(theme => ({
  root: {
    backgroundColor: props => props.color,
    height: 'auto',
    '& .MuiChip-label': {
      whiteSpace: 'normal',
    },
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
    height: 'auto',
    '& .MuiChip-label': {
      whiteSpace: 'normal',
    },
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

function StyledChip({
  label,
  value,
  color,
  onDelete,
  outlined,
  sx,
}) {
  const theme = useTheme();
  const classesSolid = useStylesSolid({ color });
  const classesOutlined = useStylesOutlined({ color });

  return (
    <Chip
      classes={outlined ? classesOutlined : classesSolid}
      label={label}
      onDelete={onDelete}
      deleteIcon={(
        <CloseIcon
          style={{
            color: outlined ? theme.palette.text.primaryDark : theme.palette.secondary.light,
          }}
          data-id={value}
        />
      )}
      size="small"
      variant={outlined ? 'outlined' : 'default'}
      clickable={false}
      sx={sx}
    />
  );
}

export default StyledChip;

StyledChip.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  color: PropTypes.string,
  onDelete: PropTypes.func,
  outlined: PropTypes.bool,
  sx: PropTypes.shape({}),
};

StyledChip.defaultProps = {
  value: undefined,
  color: undefined,
  onDelete: undefined,
  outlined: false,
  sx: undefined,
};
