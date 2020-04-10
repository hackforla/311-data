import React from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';

const DropdownItem = ({
  label,
  value,
  active,
  handleClick,
  width,
}) => {
  const itemClassName = classNames('dropdown-item', {
    'is-active': active,
  });

  return (
    <a
      key={label}
      // Extra space after # to circumvent eslint(jsx-a11y/anchor-is-valid)
      href="# "
      className={itemClassName}
      value={value}
      onClickCapture={handleClick}
      style={{ width, paddingRight: '0rem' }}
    >
      <span className="dropdown-item-label">
        {label}
      </span>
    </a>
  );
};

export default DropdownItem;

DropdownItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  active: PropTypes.bool,
  handleClick: PropTypes.func.isRequired,
  width: PropTypes.string.isRequired,
};

DropdownItem.defaultProps = {
  active: false,
};
