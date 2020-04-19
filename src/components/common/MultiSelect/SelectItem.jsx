import React from 'react';
import PropTypes from 'proptypes';
import clx from 'classnames';

const SelectItem = ({
  text,
  bold,
  status,
  onClick,
}) => (
  <div className="select-item">
    <span className={clx('select-item-text', { bold })}>
      { text }
    </span>
    <span
      className={clx('select-item-box', status)}
      role="button"
      onClick={onClick}
      onKeyDown={e => e.keyCode === 13 && onClick()}
      tabIndex={0}
      aria-label={text}
    />
  </div>
);

export default SelectItem;

SelectItem.propTypes = {
  text: PropTypes.string,
  bold: PropTypes.bool,
  status: PropTypes.oneOf([
    'selected',
    'unselected',
    'indeterminate',
  ]),
  onClick: PropTypes.func,
};

SelectItem.defaultProps = {
  text: '',
  bold: false,
  status: 'unselected',
  onClick: () => null,
};
