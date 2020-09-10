import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'proptypes';
import classNames from 'classnames';

const DropdownContent = ({
  id,
  width,
  style,
  open,
  hoverable,
  rightAligned,
  dropUp,
  className,
}) => {
  const dropdownNode = useRef();
  const [isOpen, updateIsOpen] = useState(open);
  const dropdownClassName = classNames('dropdown', {
    'is-active': isOpen,
    'is-hoverable': hoverable,
    'is-right': rightAligned,
    'is-up': dropUp,
  }, className);

  useEffect(() => {
    const handleClickOutside = e => {
      // Clicked inside dropdown
      if (dropdownNode.current.contains(e.target) || !isOpen) {
        return;
      }
      // Clicked outside dropdown
      updateIsOpen(false);
    };

    const handleEscapeKeydown = e => {
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
  });

  const toggleOpen = () => updateIsOpen(prevIsOpen => !prevIsOpen);

  return (
    <div
      id={id}
      ref={dropdownNode}
      className={dropdownClassName}
      style={{ width, ...style }}
    >
      <div
        className="dropdown-trigger"
        onClick={toggleOpen}
        style={{ width: '100%' }}
        role="presentation"
      >
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" cursor="pointer">
          <path d="M24.9661 12.4994C24.9661 5.64131 19.3918 0.0332031 12.4999 0.0332031C5.60802 0.0332031 0.0336914 5.64131 0.0336914 12.4994C0.0336914 19.3575 5.6418 24.9656 12.4999 24.9656C19.358 24.9656 24.9661 19.3575 24.9661 12.4994ZM12.4999 3.81699C13.5472 3.81699 14.3918 4.66158 14.3918 5.70888C14.3918 6.75618 13.5472 7.60077 12.4999 7.60077C11.4526 7.60077 10.608 6.75618 10.608 5.70888C10.608 4.69536 11.4526 3.81699 12.4999 3.81699ZM10.608 20.3373C10.4391 20.7089 10.1013 20.9116 9.72964 20.9116C9.5945 20.9116 9.45937 20.8778 9.32423 20.8102C8.81747 20.5737 8.61477 19.9994 8.85126 19.4927C8.85126 19.4927 10.7094 15.2359 11.0472 13.6819C11.1823 13.1413 11.2499 11.6886 11.2837 11.0129C11.2837 10.7764 11.1486 10.5737 10.9459 10.5062L6.75666 9.28996C6.21612 9.12104 5.91207 8.54672 6.08099 8.03996C6.24991 7.5332 6.82423 7.29672 7.33099 7.43185C7.33099 7.43185 11.1486 8.64807 12.4999 8.64807C13.8513 8.64807 17.7364 7.39807 17.7364 7.39807C18.2432 7.26293 18.8175 7.56699 18.9526 8.07374C19.0877 8.5805 18.7837 9.15482 18.2769 9.28996L14.1215 10.54C13.9188 10.6075 13.7499 10.8102 13.7837 11.0467C13.8175 11.7224 13.885 13.1751 14.0202 13.7156C14.358 15.2697 16.2161 19.5264 16.2161 19.5264C16.4526 20.0332 16.2161 20.6075 15.7432 20.844C15.608 20.9116 15.4729 20.9454 15.3377 20.9454C14.9661 20.9454 14.5945 20.7427 14.4594 20.371L12.4999 16.2832L10.608 20.3373Z" fill="white"/>
        </svg>
      </div>
      <div className="dropdown-menu" id="accessibility-dropdown" role="menu">
        <div className="dropdown-content">
          <div className="dropdown-content-item">
            <h2>Accessibility Information</h2>
            <br />
            <h3>Map</h3>
            <p>The map shows the Neighborhood Councils (NC) in Los Angeles. Each NC is outlined in a dotted line, and the border of each NC is outlined in a thick yellow line when hovering over it with your mouse.</p>
            <br />
            <h3>Data Visualization</h3>
            <p>Data visualizations show the results once the filter criterias are selected and submitted. The charts display details once the mouse hovers over the charts.</p>
            <br />
            <h3>Keyboard Accessibility</h3>
            <p>Use these common keyboard commands to navigate web pages without a mouse. Some keystrokes may not work with every Internet browser.</p>
            <br />
            <p>Move backward from link to link or to controls: <b>Shift + Tab</b></p>
            <p>Select buttons: <b>Spacebar</b></p>
            <p>Navigate and select Radio Buttons: <b>Arrow</b></p>
            <p>Select/deselect boxes: <b>Spacebar</b></p>
            <p>Move from box to box: <b>Tab</b></p>
            <p>Open a List Box: <b>ALT + Down arrow</b></p>
            <p>Read the prior screen: <b>CTRL + Page Up</b></p>
            <p>Read the next screen: <b>CTRL + Page Down</b></p>
            <p>Go to the top of the page: <b>CTRL + Home</b></p>
            <p>Go to the bottom of the page: <b>CTRL + End</b></p>
            <p>Close the current window (in Internet Explorer): <b>CTRL + W</b></p>
            <p>Refresh the screen: <b>F5</b></p>
            <p>Go back a page: <b>ALT + Left Arrow</b></p>
            <p>Go forward a page: <b>ALT + Right Arrow</b></p>
            <p>Navigate to &amp; select the text in the address combo box: <b>ALT + D</b></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DropdownContent;

DropdownContent.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.string,
  style: PropTypes.shape({}),
  open: PropTypes.bool,
  hoverable: PropTypes.bool,
  rightAligned: PropTypes.bool,
  dropUp: PropTypes.bool,
  className: PropTypes.string,
};

DropdownContent.defaultProps = {
  style: undefined,
  open: false,
  hoverable: false,
  rightAligned: false,
  dropUp: false,
  className: undefined,
};
