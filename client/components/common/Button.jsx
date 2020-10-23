import React from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';

const Button = ({
  id,
  label,
  ariaLabel,
  handleClick,
  className,
  /*
   *  Props below correspond with Bulma modifiers.
   *  bulma.io/documentation/elements/button/
  */
  color,
  light,
  size,
  fullWidth,
  outlined,
  inverted,
  rounded,
  hovered,
  focused,
  active,
  loading,
  isStatic,
  disabled,
  style,
  icon,
  iconStyle,
}) => {
  // Dynamically generates button className from props to comply with Bulma styling modifiers.
  const buttonClassName = classNames('button', className, {
    [`is-${color}`]: color,
    'is-light': light,
    [`is-${size}`]: size,
    'is-fullwidth': fullWidth,
    'is-outlined': outlined,
    'is-inverted': inverted,
    'is-rounded': rounded,
    'is-hovered': hovered,
    'is-focused': focused,
    'is-active': active,
    'is-loading': loading,
    'is-static': isStatic,
    'is-disabled': disabled,
  });

  const buttonId = `btn-${id}`;

  return (
    <button
      id={buttonId}
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={buttonClassName}
      style={style}
      aria-label={ariaLabel}
    >
      {icon && (
        <span className="icon is-small" style={iconStyle}>
          <i className={`fas fa-${icon}`} />
        </span>
      )}
      <span>
        {label}
      </span>
    </button>
  );
};

export default Button;

Button.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  ariaLabel: PropTypes.string,
  handleClick: PropTypes.func,
  className: PropTypes.string,
  color: PropTypes.string,
  light: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'normal', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  outlined: PropTypes.bool,
  inverted: PropTypes.bool,
  rounded: PropTypes.bool,
  hovered: PropTypes.bool,
  focused: PropTypes.bool,
  active: PropTypes.bool,
  loading: PropTypes.bool,
  isStatic: PropTypes.bool,
  disabled: PropTypes.bool,
  style: PropTypes.shape({}),
  iconStyle: PropTypes.shape({}),
  icon: PropTypes.string,
};

Button.defaultProps = {
  label: null,
  ariaLabel: null,
  handleClick: () => null,
  className: undefined,
  color: 'primary',
  light: false,
  size: 'normal',
  fullWidth: false,
  outlined: false,
  inverted: false,
  rounded: false,
  hovered: false,
  focused: false,
  active: false,
  loading: false,
  isStatic: false,
  disabled: false,
  style: undefined,
  iconStyle: undefined,
  icon: undefined,
};
