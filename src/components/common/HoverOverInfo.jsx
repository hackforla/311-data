import React from 'react';
import PropTypes from 'proptypes';

const HoverOverInfo = ({
  title,
  text,
  position,
  children,
}) => (
  <span
    data-for="react-tooltip"
    data-tip={JSON.stringify({ title, text })}
    data-place={position}
  >
    { children }
  </span>
);

export default HoverOverInfo;

HoverOverInfo.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  children: PropTypes.element,
};

HoverOverInfo.defaultProps = {
  title: undefined,
  text: undefined,
  position: 'right',
  children: (<div />),
};
