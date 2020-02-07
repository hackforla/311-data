import React, { useState } from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';
import Checkbox from './Checkbox';

const items = ['Last Week', 'Last Month', 'Last 6 Months', 'Last 12 Months', 'Year to Date', 'Custom Range'];

const DropdownItem = ({
  label,

  tag,
  active,
  hoverHandler

  // handleOptionClick,
}) => {
  const [isActive, toggleItemActive] = useState(!!active);
  const dropdownItemClassName = classNames('dropdown-item', {
    'is-active': isActive,
  });

  return (
    <a
      href="# "
      className={dropdownItemClassName}
      style={{ paddingRight: '0rem', width: '300px' }}
      tag={tag}
      // onMouseEnter={() => toggleItemActive((prevItemActive) => !prevItemActive)}
      // onMouseLeave={() => toggleItemActive((prevItemActive) => !prevItemActive)}
    >
      {label}
      <span style={{ float: 'right' }}>
        <Checkbox
          id={label}
          circle
          color="black"
        />
      </span>
    </a>
  );
};


const Dropdown = ({
  id,
  list,
  label,
  handleClick,
  style,

  open,
  hoverable,
  rightAligned,
  dropUp,
}) => {
  const [isOpen, toggleOpen] = useState(!!open);
  const dropdownClassName = classNames('dropdown', {
    'is-active': isOpen,
    'is-hoverable': hoverable,
    'is-right': rightAligned,
    'is-up': dropUp,
  });

  return (
    <div className={dropdownClassName} style={style}>
      <div className="dropdown-trigger" style={{ width: '100%'}}>
        <button
          type="button"
          className="button"
          onClick={() => toggleOpen((prevActive) => !prevActive)}
          style={{ display: 'block', width: '100%' }}
        >
          <span style={{ float: 'left' }}>{label}</span>
          <span style={{ float: 'right' }}>&#8964;</span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">

          {
            list.map((item) => {
              return (
                <DropdownItem
                  key={item}
                  label={item}
                />
              );
            })
          }

        </div>
      </div>
    </div>
  );
};

export default Dropdown;


Dropdown.propTypes = {


};

Dropdown.defaultProps = {

};
