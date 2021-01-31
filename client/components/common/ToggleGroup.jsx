import { makeStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

export default function ToggleGroup({
  children, onToggle, value, rounded,
}) {
  const [firstChild] = children;
  const [selected, setSelected] = React.useState(
    value || firstChild.props.value,
  );

  const useStyles = makeStyles(theme => {
    const borderRadius = {
      borderRadius: rounded ? theme.borderRadius.lg : theme.borderRadius.sm,
    };

    return {
      root: {
        backgroundColor: theme.palette.primary.dark,
        padding: theme.gaps.xs,
        display: 'inline-flex',
        alignItems: 'center',
        ...borderRadius,
      },
      regular: {
        ...borderRadius,
        ...theme.typography.body2,
        padding: theme.gaps.sm,
        backgroundColor: theme.palette.primary.dark,
        height: rounded ? 25 : 'auto',
        color: theme.palette.text.secondaryLight,
      },
      selected: {
        backgroundColor: theme.palette.primary.main,
      },
    };
  });

  const classes = useStyles();

  const addClasses = component => {
    const { props } = component;
    let className = '';
    if (props.value === selected) {
      className = `${classes.selected} ${classes.regular}`;
    } else {
      className = classes.regular;
    }

    const clone = React.cloneElement(component, { className });

    return clone;
  };

  const handleClick = e => {
    if (e.target.classList.contains(classes.root)) return;

    let element = e.target;

    while (!element.parentElement.classList.contains(classes.root)) {
      element = element.parentElement;
    }

    setSelected(element.value);
    if (onToggle) onToggle(element.value);
  };

  return (
    <div className={classes.root} aria-hidden onClick={handleClick}>
      {children.map(component => addClasses(component))}
    </div>
  );
}

ToggleGroup.propTypes = {
  onToggle: PropTypes.func,
  rounded: PropTypes.bool,
  value: PropTypes.string,
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

ToggleGroup.defaultProps = {
  rounded: false,
  value: '',
  onToggle: undefined,
};
