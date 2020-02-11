import React from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';
import Checkbox from './Checkbox';

const DropdownItem = ({
  label,
  value,
  active,
  handleClick,
}) => {
  const itemClassName = classNames('dropdown-item', {
    'is-active': active,
  });

  const itemWidth = '350px';

  return (
    <a
      key={label}
      // Extra space after # to circumvent eslint(jsx-a11y/anchor-is-valid)
      href="# "
      className={itemClassName}
      value={value}
      onClickCapture={handleClick}
      style={{ paddingRight: '0rem', width: itemWidth }}
    >
      <span id="dropdown-item-label">
        {label}
      </span>
      <span style={{ position: 'absolute', right: '0' }}>
        <Checkbox
          id={`dd-chkbx-${label}`}
          checked={active}
          circle
          color="grey"
        />
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
};

DropdownItem.defaultProps = {
  active: false,
};
