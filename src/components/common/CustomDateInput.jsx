import React from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';

const CustomDateInput = ({
  value,
  handleClick,
  placeHolder,
  color,
  size,
  rounded,
  hovered,
  focused,
  loading,
  disabled,
  readOnly,
  isStatic,

}) => {
  const inputClassName = classNames('input', {
    [`is-${color}`]: color,
    [`is-${size}`]: size,
    'is-rounded': rounded,
    'is-hovered': hovered,
    'is-focused': focused,
    'is-loading': loading,
    'is-static': isStatic,
  });

  return (
    <input
      className={inputClassName}
      placeHolder={placeHolder}
      value={value}
      onClick={handleClick}
      disabled={disabled}
      readOnly={readOnly}
    />
  );
};

export default CustomDateInput;

CustomDateInput.propTypes = {
  value: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  placeHolder: PropTypes.string,
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  rounded: PropTypes.bool,
  hovered: PropTypes.bool,
  focused: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  isStatic: PropTypes.bool,
};

CustomDateInput.defaultProps = {
  value: PropTypes.string,
  placeHolder: '',
  color: 'primary',
  size: '',
  rounded: false,
  hovered: false,
  focused: false,
  loading: false,
  disabled: false,
  readOnly: false,
  isStatic: false,
};
