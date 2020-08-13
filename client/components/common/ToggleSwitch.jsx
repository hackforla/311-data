import React from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';

const ToggleSwitch = ({
  id,
  handleClick,
  label,
  name,
  /*
   *  Props below correspond with Bulma modifiers.
   *  wikiki.github.io/form/switch/
  */
  rightToLeft,
  color,
  size,
  thin,
  rounded,
  outlined,
  disabled,
}) => {
  const toggleswitchClassName = classNames('switch', {
    'is-rtl': rightToLeft,
    [`is-${color}`]: color,
    [`is-${size}`]: size,
    'is-thin': thin,
    'is-rounded': rounded,
    'is-outlined': outlined,
  });

  const toggleswitchId = `toggleswitch-${id}`;

  return (
    <>
      <input
        type="checkbox"
        id={toggleswitchId}
        onChange={handleClick}
        name={name}
        className={toggleswitchClassName}
        disabled={disabled}
      />
      <label htmlFor={toggleswitchId}>
        {label}
      </label>
    </>
  );
};

export default ToggleSwitch;

ToggleSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  handleClick: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string,
  rightToLeft: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', '', 'medium', 'large']),
  thin: PropTypes.bool,
  rounded: PropTypes.bool,
  outlined: PropTypes.bool,
  disabled: PropTypes.bool,
};

ToggleSwitch.defaultProps = {
  handleClick: () => null,
  label: null,
  name: null,
  rightToLeft: false,
  color: 'primary',
  size: '',
  thin: false,
  rounded: false,
  outlined: false,
  disabled: false,
};
