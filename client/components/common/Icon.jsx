/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';

const Icon = ({
  id,
  label,
  handleClick,
  icon,
  /*
  *  Props below correspond with Bulma modifiers.
  */
  size,
  iconSize,
  iconStyle,
  className,
  fixedWidth,
  spin,
  pulse,
  bordered,
  color,
  style,
}) => {
  // Dynamically generates infoIcon className from props to comply with Bulma styling modifiers.
  const containerClassName = classNames('icon', {
    [`has-text-${color}`]: color,
    [`is-${size}`]: size, // for small, meduim, large, span tag
  });

  const iconClassName = classNames({
    [`fas fa-${icon}`]: icon,
    [`fa-${iconSize}`]: iconSize, // for fa-lg, fa-2x, fa-3x, icon tag
    'fa-fw': fixedWidth,
    'fa-border': bordered,
    'fa-spin': spin,
    'fa-pulse': pulse,
  }, className);

  const iconId = `icon-${id}`;

  return (
    <span
      id={iconId}
      onClick={handleClick}
      className={containerClassName}
      style={style}
    >
      <i className={iconClassName} style={iconStyle} />
      {label}
    </span>
  );
};

export default Icon;

Icon.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  handleClick: PropTypes.func,
  color: PropTypes.oneOf([
    'white',
    'black',
    'dark',
    'light',
    'primary',
    'info',
    'link',
    'success',
    'warning',
    'danger',
    'black-bis',
    'black-ter',
    'grey-darker',
    'grey-dark',
    'grey',
    'grey-light',
    'grey-lighter',
    'white-ter',
    'white-bis',
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  iconSize: PropTypes.oneOf(['lg', '2x', '3x']),
  icon: PropTypes.string,
  className: PropTypes.string,
  fixedWidth: PropTypes.bool,
  spin: PropTypes.bool,
  pulse: PropTypes.bool,
  bordered: PropTypes.bool,
  style: PropTypes.shape({}),
  iconStyle: PropTypes.shape({}),
};

Icon.defaultProps = {
  label: null,
  handleClick: () => null,
  color: undefined,
  size: undefined,
  icon: 'home',
  iconSize: undefined,
  className: undefined,
  fixedWidth: false,
  spin: false,
  pulse: false,
  bordered: false,
  style: undefined,
  iconStyle: undefined,
};
