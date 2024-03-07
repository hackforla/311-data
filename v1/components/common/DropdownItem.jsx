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
    <div
      key={label}
      className={itemClassName}
      value={value}
      onClickCapture={handleClick}
      style={{ width, paddingRight: '0rem' }}
      role="menuitem"
    >
      <span className="dropdown-item-label">
        {label}
      </span>
    </div>
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
