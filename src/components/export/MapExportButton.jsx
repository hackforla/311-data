import React, { useState } from 'react';
import PropTypes from 'proptypes';
import leafletImage from 'leaflet-image';
import LoaderButton from '@components/common/LoaderButton';
import { download } from './utils';

const MapExportButton = ({
  map,
  style,
}) => {
  const [loading, setLoading] = useState(false);

  const exportMap = () => {
    setLoading(true);

    leafletImage(map(), (err, canvas) => {
      setLoading(false);
      if (!err) {
        download.canvas(canvas, 'map');
      }
    });
  };

  return (
    <LoaderButton
      label="Export"
      loading={loading}
      cta
      style={style}
      onClick={exportMap}
    />
  );
};

export default MapExportButton;

MapExportButton.propTypes = {
  map: PropTypes.func.isRequired,
  style: PropTypes.shape({}),
};

MapExportButton.defaultProps = {
  style: undefined,
};
