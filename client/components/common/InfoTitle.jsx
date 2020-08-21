import React from 'react';
import PropTypes from 'proptypes';
import HoverOverInfo from './HoverOverInfo';
import Icon from './Icon';

const InfoTitle = ({
  title,
  element,
  infoText,
  position,
}) => {
  const titleEl = React.createElement(
    element,
    {
      style: {
        display: 'inline-block',
        margin: '15px 5px 5px 0',
      },
    },
    title,
  );

  return (
    <div className="info-title">
      { titleEl }
      <HoverOverInfo
        title={title}
        text={infoText}
        position={position}
      >
        <Icon
          id={`info-icon-${title}`}
          icon="info-circle"
          size="small"
        />
      </HoverOverInfo>
    </div>
  );
};

export default InfoTitle;

InfoTitle.propTypes = {
  title: PropTypes.string,
  element: PropTypes.string,
  infoText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
};

InfoTitle.defaultProps = {
  title: '',
  element: 'h1',
  infoText: '',
  position: 'right',
};
