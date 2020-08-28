import L from 'leaflet';
import {} from 'mapbox-gl-leaflet';
import PropTypes from 'proptypes';
import { GridLayer, withLeaflet } from 'react-leaflet';

class MapboxVectorLayer extends GridLayer {
  // eslint-disable-next-line
  createLeafletElement(props) {
    return L.mapboxGL(props);
  }
}

MapboxVectorLayer.propTypes = {
  accessToken: PropTypes.string.isRequired,
  style: PropTypes.string,
};

MapboxVectorLayer.defaultProps = {
  style: 'mapbox://styles/mapbox/streets-v9',
};

export default withLeaflet(MapboxVectorLayer);
