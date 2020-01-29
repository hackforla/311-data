import React from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';

const ToggleSwitch = ({
  id,
  rtl,
  color,
  size,
  thin,
  rounded,
  outlined,
  disabled,
  handleToggleClick,
  leftLabel,
  rightLabel,
  name,
}) => {
  const toggleswitchClassName = classNames('switch', {
    'is-rtl': rtl,
    [`is-${color}`]: color,
    [`is-${size}`]: size,
    'is-thin': thin,
    'is-rounded': rounded,
    'is-outlined': outlined,
  });

  const toggleswitchId = `toggleswitch-${id}`;

  return (
    <div className="field">
      <label htmlFor={toggleswitchId}>
        {leftLabel}
      </label>
      <input
        type="checkbox"
        id={toggleswitchId}
        name={name}
        className={toggleswitchClassName}
        onChange={handleToggleClick}
        disabled={disabled}
      />
      <label htmlFor={toggleswitchId}>
        {rightLabel}
      </label>
    </div>
  );
};

export default ToggleSwitch;

ToggleSwitch.propTypes = {
  id: PropTypes.string,
  rtl: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'normal', 'medium', 'large']),
  thin: PropTypes.bool,
  rounded: PropTypes.bool,
  outlined: PropTypes.bool,
  disabled: PropTypes.bool,
  handleToggleClick: PropTypes.func,
  leftLabel: PropTypes.string,
  rightLabel: PropTypes.string,
  name: PropTypes.string,
};

ToggleSwitch.defaultProps = {
  id: null,
  rtl: false,
  color: 'primary',
  size: 'normal',
  thin: false,
  rounded: false,
  outlined: false,
  disabled: false,
  handleToggleClick: () => null,
  leftLabel: null,
  rightLabel: null,
  name: null,
};
