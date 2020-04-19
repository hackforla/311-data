import React from 'react';
import PropTypes from 'proptypes';
import HoverOverInfo from './HoverOverInfo';
import Icon from './Icon';

const InfoTitle = ({
  title,
  element,
  infoText,
}) => {
  const titleEl = React.createElement(
    element,
    {
      style: {
        display: 'inline-block',
        marginRight: 10,
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
};

InfoTitle.defaultProps = {
  title: '',
  element: 'h1',
  infoText: '',
};
