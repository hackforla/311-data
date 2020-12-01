/* eslint-disable max-len */

import React, { useState } from 'react';
import classNames from 'classnames';
import { ACCESSIBILITY_INSTRUCTIONS } from '@components/common/CONSTANTS';

const AccessibilityPane = () => {
  const [isOpen, updateIsOpen] = useState(false);
  const dropdownClassName = classNames('dropdown', {
    'is-active': isOpen,
  });

  const handleClick = () => {
    updateIsOpen(!isOpen);
  };

  const handleKeyDown = e => {
    if (e.key === ' ' || e.key === 'Enter') {
      handleClick(e);
    }
  };

  const renderInstructions = () => ACCESSIBILITY_INSTRUCTIONS.map((element, index) => {
    if (index % 2 !== 0) {
      return (
        <div className="instruction" key={index.toString()}>
          <p>
            {element.instruction}
            <b>{element.shortcut}</b>
          </p>
        </div>
      );
    }

    return (
      <div className="instruction offset" key={index.toString()}>
        <p>
          {element.instruction}
          <b>{element.shortcut}</b>
        </p>
      </div>
    );
  });

  return (
    <div // eslint-disable-line
      className={dropdownClassName}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-expanded={isOpen}
      role="button"
    >
      <div
        className="dropdown-trigger"
        onClick={handleClick}
        style={{ width: '100%' }}
        role="presentation"
      >
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" cursor="pointer">
          <path d="M24.9661 12.4994C24.9661 5.64131 19.3918 0.0332031 12.4999 0.0332031C5.60802 0.0332031 0.0336914 5.64131 0.0336914 12.4994C0.0336914 19.3575 5.6418 24.9656 12.4999 24.9656C19.358 24.9656 24.9661 19.3575 24.9661 12.4994ZM12.4999 3.81699C13.5472 3.81699 14.3918 4.66158 14.3918 5.70888C14.3918 6.75618 13.5472 7.60077 12.4999 7.60077C11.4526 7.60077 10.608 6.75618 10.608 5.70888C10.608 4.69536 11.4526 3.81699 12.4999 3.81699ZM10.608 20.3373C10.4391 20.7089 10.1013 20.9116 9.72964 20.9116C9.5945 20.9116 9.45937 20.8778 9.32423 20.8102C8.81747 20.5737 8.61477 19.9994 8.85126 19.4927C8.85126 19.4927 10.7094 15.2359 11.0472 13.6819C11.1823 13.1413 11.2499 11.6886 11.2837 11.0129C11.2837 10.7764 11.1486 10.5737 10.9459 10.5062L6.75666 9.28996C6.21612 9.12104 5.91207 8.54672 6.08099 8.03996C6.24991 7.5332 6.82423 7.29672 7.33099 7.43185C7.33099 7.43185 11.1486 8.64807 12.4999 8.64807C13.8513 8.64807 17.7364 7.39807 17.7364 7.39807C18.2432 7.26293 18.8175 7.56699 18.9526 8.07374C19.0877 8.5805 18.7837 9.15482 18.2769 9.28996L14.1215 10.54C13.9188 10.6075 13.7499 10.8102 13.7837 11.0467C13.8175 11.7224 13.885 13.1751 14.0202 13.7156C14.358 15.2697 16.2161 19.5264 16.2161 19.5264C16.4526 20.0332 16.2161 20.6075 15.7432 20.844C15.608 20.9116 15.4729 20.9454 15.3377 20.9454C14.9661 20.9454 14.5945 20.7427 14.4594 20.371L12.4999 16.2832L10.608 20.3373Z" fill="white" />
        </svg>
      </div>
      <div className="dropdown-menu" id="accessibility-dropdown" role="menu">
        <div className="dropdown-content">
          <div className="dropdown-content-item">
            <h2>Accessibility Information</h2>
            <h3>Map</h3>
            <p>The map shows the Neighborhood Councils (NC) in Los Angeles. Each NC is outlined in a dotted line, and the border of each NC is outlined in a thick yellow line when hovering over it with your mouse.</p>
            <h3>Data Visualization</h3>
            <p>Data visualizations show the results once the filter criterias are selected and submitted. The charts display details once the mouse hovers over the charts.</p>
            <h3>Keyboard Accessibility</h3>
            <p>Use these common keyboard commands to navigate web pages without a mouse. Some keystrokes may not work with every Internet browser.</p>
          </div>
          <div className="dropdown-content-item key-instructions">
            {renderInstructions()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityPane;
