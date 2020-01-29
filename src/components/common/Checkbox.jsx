import React from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';

const Checkbox = ({
  id,
  type,
  rtl,
  color,
  size,
  circle,
  block,
  hasNoBorder,
  hasBackgroundColor,
  disabled,
  handleCheckboxClick,
  label,
  name,
}) => {
  // Dynamically generates checkbox className from props to comply with Bulma styling modifiers.
  const checkboxClassName = classNames('is-checkradio', {
    'is-rtl': rtl,
    [`is-${color}`]: color,
    [`is-${size}`]: size,
    'is-circle': circle,
    'is-block': block,
    'has-no-border': hasNoBorder,
    'has-background-color': hasBackgroundColor,
  });

  const checkboxId = `checkbox-${id}`;

  return (
    <div className="field">
      <input
        id={checkboxId}
        type={type}
        className={checkboxClassName}
        onChange={handleCheckboxClick}
        disabled={disabled}
        name={name}
      />
      <label htmlFor={checkboxId}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;

Checkbox.propTypes = {
  id: PropTypes.string,
  type: PropTypes.oneOf(['checkbox', 'radio']),
  rtl: PropTypes.bool,
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'normal', 'medium', 'large']),
  circle: PropTypes.bool,
  block: PropTypes.bool,
  hasNoBorder: PropTypes.bool,
  hasBackgroundColor: PropTypes.bool,
  disabled: PropTypes.bool,
  handleCheckboxClick: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string,
};

Checkbox.defaultProps = {
  id: null,
  type: 'checkbox',
  rtl: false,
  color: 'primary',
  size: 'normal',
  circle: false,
  block: false,
  hasNoBorder: false,
  hasBackgroundColor: false,
  disabled: false,
  handleCheckboxClick: () => null,
  label: null,
  name: null,
};
