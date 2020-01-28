import React from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';
import { useId } from 'react-id-generator';

const ToggleSwitch = ({
  rtl,
  color,
  size,
  thin,
  rounded,
  outlined,
  disabled,
  handleToggleClick,
  label,
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

  const [uniqueId] = useId();
  const htmlId = `toggleswitch-${uniqueId}`;

  return (
    <div className="field">
      <input
        type="checkbox"
        id={htmlId}
        name={name}
        className={toggleswitchClassName}
        onChange={handleToggleClick}
        disabled={disabled}
      />
      <label htmlFor={htmlId}>
        {label}
      </label>
    </div>
  );
};

export default ToggleSwitch;

ToggleSwitch.propTypes = {
  rtl: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'normal', 'medium', 'large']),
  thin: PropTypes.bool,
  rounded: PropTypes.bool,
  outlined: PropTypes.bool,
  disabled: PropTypes.bool,
  handleToggleClick: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string,
};

ToggleSwitch.defaultProps = {
  rtl: false,
  color: 'primary',
  size: 'normal',
  thin: false,
  rounded: false,
  outlined: false,
  disabled: false,
  handleToggleClick: () => null,
  label: null,
  name: null,
};
