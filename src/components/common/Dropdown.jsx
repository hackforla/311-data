import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';
import Checkbox from './Checkbox';

const Dropdown = ({
  id,
  list,
  title,
  handleClick,
  style,
  open,
  hoverable,
  rightAligned,
  dropUp,
}) => {
  const dropdownNode = useRef();
  const [isOpen, updateIsOpen] = useState(!!open);
  const [currentSelection, updateSelection] = useState(title);
  const dropdownClassName = classNames('dropdown', {
    'is-active': isOpen,
    'is-hoverable': hoverable,
    'is-right': rightAligned,
    'is-up': dropUp,
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Clicked inside dropdown
      if (dropdownNode.current.contains(e.target) || !isOpen) {
        return;
      }
      // Clicked outside dropdown
      updateIsOpen(false);
    };

    const handleEscapeKeydown = (e) => {
      // Non-esc key pressed
      if (e.keyCode !== 27 || !isOpen) {
        return;
      }
      updateIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKeydown);
    } else {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKeydown);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKeydown);
    };
  }, [isOpen, currentSelection]);

  const toggleOpen = () => updateIsOpen((prevIsOpen) => !prevIsOpen);

  const handleItemClick = (e) => {
    e.preventDefault();
    updateIsOpen(false);
    updateSelection(e.currentTarget.title);
    handleClick(e);
  };

  const renderDropdownItems = (items) => items.map((item) => (
    <DropdownItem
      key={item.label}
      label={item.label}
      value={item.value}
      active={item.label === currentSelection}
      checked={item.label === currentSelection}
      handleClick={handleItemClick}
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
        onClick={toggleOpen}
        style={{ width: '100%' }}
        role="presentation"
      >
        <button
          type="button"
          className="button"
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
        </div>
      </div>
    </div>
  );
};

const DropdownItem = ({
  label,
  value,
  active,
  handleClick,
}) => {
  const itemClassName = classNames('dropdown-item', {
    'is-active': active,
  });

  return (
    <a
      key={label}
      // Extra space after # to circumvent eslint rule
      href="# "
      className={itemClassName}
      title={label}
      onClickCapture={handleClick}
      style={{ paddingRight: '0rem', width: '300px' }}
    >
      <span style={{ width: '100%', zIndex: '1' }}>
        {label}
      </span>
      <span style={{ float: 'right', position: 'absolute', right: '0', display: 'inline-block', zIndex: '0' }}>
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


export default Dropdown;

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
  list: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })).isRequired,
  title: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  style: PropTypes.shape({}),
  open: PropTypes.bool,
  hoverable: PropTypes.bool,
  rightAligned: PropTypes.bool,
  dropUp: PropTypes.bool,
};

Dropdown.defaultProps = {
  style: undefined,
  open: false,
  hoverable: false,
  rightAligned: false,
  dropUp: false,
};
