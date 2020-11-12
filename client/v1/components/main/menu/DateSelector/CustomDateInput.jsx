import React, { forwardRef } from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';

// NOTE: This component is not currently 100% working and is not in use.
//       To be completed after MVP.

const CustomDateInput = ({
  value,
  onClick,
  onChange,
  color,
  size,
  rounded,
  hovered,
  focused,
  loading,
  disabled,
  readOnly,
  isStatic,
}, ref) => {
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
    <>
      <input
        ref={ref}
        className={inputClassName}
        value={value}
        onClick={onClick}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        type="text"
      />
    </>
  );
};

export default forwardRef(CustomDateInput);

CustomDateInput.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'danger']),
  size: PropTypes.oneOf([undefined, 'small', 'medium', 'large']),
  rounded: PropTypes.bool,
  hovered: PropTypes.bool,
  focused: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  isStatic: PropTypes.bool,
};

CustomDateInput.defaultProps = {
  value: '',
  color: 'primary',
  size: undefined,
  rounded: false,
  hovered: false,
  focused: false,
  loading: false,
  disabled: false,
  readOnly: false,
  isStatic: false,
};
