import React, { useState } from 'react';
import PropTypes from 'proptypes';
import Icon from './Icon';
import Tooltip from './Tooltip';

const HoverOverInfo = ({
  title,
  text,
  position,
  children,
  tabIndex,
  style,
  onKeyUp,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    // eslint-disable-next-line
    <span
      className="hover-over-info"
      onMouseEnter={() => setShowTooltip(true)}
      onFocus={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onBlur={() => setShowTooltip(false)}
      onKeyUp={onKeyUp}
      tabIndex={tabIndex}
      style={style}
    >
      { children }
      { showTooltip && (
        <Tooltip position={position}>
          <div className="hover-over-tooltip">
            { title && (
              <Icon
                id={`tooltip-icon-${title}`}
                icon="info-circle"
                size="small"
              />
            )}
            <div className="hover-over-tooltip-text">
              { title && (
                <div className="title-row">
                  { title }
                </div>
              )}
              {
                text instanceof Array
                  ? (
                    text.map((line, idx) => (
                      <p key={idx.toString()}>{ line }</p>
                    ))
                  )
                  : <p>{ text }</p>
              }
            </div>
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
  tabIndex: PropTypes.number,
  style: PropTypes.shape({}),
  onKeyUp: PropTypes.func,
};

HoverOverInfo.defaultProps = {
  title: undefined,
  text: undefined,
  position: 'right',
  children: (<div />),
  tabIndex: 0,
  style: {},
  onKeyUp: () => {},
};
