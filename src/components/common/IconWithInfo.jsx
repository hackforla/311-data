/*
  This is just a regular Icon with an info box that pops up when you hover
  on the icon.

  It accepts all of the props an Icon accepts, plus:

  infoTitle: title in the info box
  infoText: text in the info box
  infoPosition: the position of the box with respect to the icon (defaulting to 'right')
*/

import React from 'react';
import PropTypes from 'proptypes';
import Icon from './Icon';

const IconWithInfo = ({
  id,
  infoTitle,
  infoText,
  infoPosition,
  ...iconProps
}) => (
  <span
    data-for="react-tooltip"
    data-tip={JSON.stringify({
      title: infoTitle,
      text: infoText
    })}
    data-place={infoPosition}>
    <Icon
      id={id}
      icon="info-circle"
      size="small"
      { ...iconProps }
    />
  </span>
);

export default IconWithInfo;

IconWithInfo.propTypes = {
  id: PropTypes.string.isRequired,
  infoTitle: PropTypes.string,
  infoText: PropTypes.string,
  infoPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
};

IconWithInfo.defaultProps = {
  infoPosition: 'right'
};
