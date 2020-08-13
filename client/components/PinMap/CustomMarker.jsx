import React from 'react';
import PropTypes from 'proptypes';
import { renderToString } from 'react-dom/server';
import { Marker } from 'react-leaflet';
import { divIcon } from 'leaflet';
import Icon from '@components/common/Icon';

const CustomMarker = ({
  position,
  onClick,
  color,
  style,
  icon,
  size,
  children,
}) => {
  const markerIcon = divIcon({
    className: 'custom-marker-icon',
    html: renderToString(<Icon id="marker-icon" icon={icon} iconSize={size} style={{ color, ...style }} />),
  });

  return (
    <Marker position={position} onClick={onClick} icon={markerIcon}>
      {children}
    </Marker>
  );
};

export default CustomMarker;

CustomMarker.propTypes = {
  position: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string,
  style: PropTypes.shape({}),
  icon: PropTypes.string,
  size: PropTypes.string,
  children: PropTypes.node,
};

CustomMarker.defaultProps = {
  color: 'blue',
  style: {},
  icon: 'map-marker-alt',
  size: '3x',
  children: null,
};
