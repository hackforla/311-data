import React from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';
import { useId } from 'react-id-generator';

const Checkbox = ({
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

  const [uniqueId] = useId();
  const htmlId = `checkbox-${uniqueId}`;

  return (
    <div className="field">
      <input
        type={type}
        id={htmlId}
        className={checkboxClassName}
        onChange={handleCheckboxClick}
        disabled={disabled}
        name={name}
      />
      <label htmlFor={htmlId}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;

Checkbox.propTypes = {
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
  type: 'checkbox',
  rtl: false,
  color: null,
  size: PropTypes.oneOf(['small', 'normal', 'medium', 'large']),
  circle: false,
  block: false,
  hasNoBorder: false,
  hasBackgroundColor: false,
  disabled: false,
  handleCheckboxClick: () => null,
  label: null,
  name: null,
};
