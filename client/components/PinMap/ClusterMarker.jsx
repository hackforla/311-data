import React from 'react';
import PropTypes from 'proptypes';
import { Marker } from 'react-leaflet';
import { divIcon, point } from 'leaflet';

function markerClass(count) {
  if (count < 100) return 'small';
  if (count < 1000) return 'medium';
  return 'large';
}

function abbreviatedCount(count) {
  if (count < 1000) return count;
  if (count < 10000) return `${(count / 1000).toFixed(1)}K`;
  if (count < 1000000) return `${(count / 1000).toFixed(0)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
}

const ClusterMarker = ({
  position,
  count,
  onClick,
}) => {
  const markerIcon = divIcon({
    html: `<div><span>${abbreviatedCount(count)}</span></div>`,
    className: `marker-cluster marker-cluster-${markerClass(count)}`,
    iconSize: point(40, 40),
  });

  return (
    <Marker position={position} onClick={onClick} icon={markerIcon} />
  );
};

export default ClusterMarker;

ClusterMarker.propTypes = {
  position: PropTypes.node.isRequired,
  count: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};
