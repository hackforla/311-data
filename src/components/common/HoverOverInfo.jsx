import React, { useState } from 'react';
import PropTypes from 'proptypes';
import Icon from './Icon';
import Tooltip from './Tooltip';

const HoverOverInfo = ({
  title,
  text,
  position,
  children,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span
      className="is-relative"
      onMouseEnter={() => setShowTooltip(true)}
      onFocus={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onBlur={() => setShowTooltip(false)}
    >
      { children }
      { showTooltip && (
        <Tooltip position={position}>
          <div className="hover-over-tooltip">
            { title && (
              <div className="title-row">
                <Icon
                  id="tooltip-icon"
                  icon="info-circle"
                  size="small"
                  style={{ marginRight: '6px' }}
                />
                { title }
              </div>
            )}
            {
              text instanceof Array
                ? (
                  text.map((line, idx) => (
                    <div key={idx.toString()}>{ line }</div>
                  ))
                )
                : text
            }
          </div>
        </Tooltip>
      )}
    </span>
  );
};

export default HoverOverInfo;

HoverOverInfo.propTypes = {
  title: PropTypes.string,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  children: PropTypes.node,
};

HoverOverInfo.defaultProps = {
  title: undefined,
  text: undefined,
  position: 'right',
  children: (<div />),
};
