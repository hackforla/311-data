import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';
import Checkbox from './Checkbox';

const DropdownItem = ({
  label,
  name,
  selected,
  handleClick,
}) => (
  <a
    key={label}
    href="# "
    className="dropdown-item"
    name={name}
    onClick={handleClick}
    style={{ paddingRight: '0rem', width: '300px' }}
  >
    {label}
    <span style={{ float: 'right' }}>
      <Checkbox
        id={`dd-chkbx-${label}`}
        checked={selected}
        circle
        color="grey"
      />
    </span>
  </a>
);

const Dropdown = ({
  id,
  list,
  title,
  handleClick,
  children,
  style,
  open,
  hoverable,
  rightAligned,
  dropUp,
}) => {
  const dropdownNode = useRef();
  const [isOpen, updateIsOpen] = useState(!!open);
  const [currentSelection, updateSelection] = useState(null);
  const dropdownClassName = classNames('dropdown', {
    'is-active': isOpen,
    'is-hoverable': hoverable,
    'is-right': rightAligned,
    'is-up': dropUp,
  });

  const handleOutsideClick = (e) => {
    // clicked inside dropdown
    if (dropdownNode.current.contains(e.target)) {
      return;
    }
    // clicked outside dropdown
    updateIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

  const toggleOpen = () => updateIsOpen((prevIsOpen) => !prevIsOpen);

  const handleItemClick = (e) => {
    e.preventDefault();
    toggleOpen();
    updateSelection(e.target.name);
    handleClick(e);
  };

  const renderDropdownItems = (items) => items.map((item) => (
    <DropdownItem
      key={item}
      label={item}
      name={item}
      checked={item === currentSelection}
      handleClick={(e) => handleItemClick(e)}
    />
  ));

  return (
    <div
      id={id}
      ref={dropdownNode}
      className={dropdownClassName}
      style={style}
    >
      <div
        className="dropdown-trigger"
        style={{ width: '100%' }}
      >
        <button
          type="button"
          className="button"
          onClick={() => toggleOpen()}
          style={{ display: 'block', width: '100%' }}
        >
          <span
            id="dd-title"
            style={{ float: 'left' }}
          >
            {currentSelection || title}
          </span>
          <span
            id="dd-icon"
            style={{ float: 'right' }}
          >
            { /* replace isOpen icons with fas icons once Icon component is merged in */ }
            { isOpen ? '˄' : '⌄' }
          </span>
        </button>
      </div>
      <div className="dropdown-menu" id="dropdown-menu" role="menu">
        <div className="dropdown-content">
          { renderDropdownItems(list) }
          { children }
        </div>
      </div>
    </div>
  );
};

export default Dropdown;

export {
  DropdownItem,
};

DropdownItem.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

DropdownItem.defaultProps = {
  selected: false,
};

Dropdown.propTypes = {
  id: PropTypes.string.isRequired,
  // update list proptypes
  list: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  style: PropTypes.shape({}),
  open: PropTypes.bool,
  hoverable: PropTypes.bool,
  rightAligned: PropTypes.bool,
  dropUp: PropTypes.bool,
};

Dropdown.defaultProps = {
  children: null,
  style: undefined,
  open: false,
  hoverable: false,
  rightAligned: false,
  dropUp: false,
};
