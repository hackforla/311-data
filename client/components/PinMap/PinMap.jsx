import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPinInfoRequest } from '@reducers/data';
import { updateMapPosition } from '@reducers/ui';
import { trackMapExport } from '@reducers/analytics';
import PinPopup from '@components/PinMap/PinPopup';
import CustomMarker from '@components/PinMap/CustomMarker';
import ClusterMarker from '@components/PinMap/ClusterMarker';
import HeatmapLegend from '@components/PinMap/HeatmapLegend';
import ExportLegend from '@components/PinMap/ExportLegend';
import MapboxWordmark from '@components/PinMap/MapboxWordmark';
import {
  Map,
  TileLayer,
  LayersControl,
  ZoomControl,
  ScaleControl,
  withLeaflet,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import Choropleth from 'react-leaflet-choropleth';
import HeatmapLayer from 'react-leaflet-heatmap-layer';
import PropTypes from 'proptypes';
import COLORS from '@styles/COLORS';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import PrintControlDefault from 'react-leaflet-easyprint';
import Button from '@components/common/Button';

// import neighborhoodOverlay from '../../data/la-county-neighborhoods-v6.json';
// import municipalOverlay from '../../data/la-county-municipal-regions-current.json';
// import councilDistrictsOverlay from '../../data/la-city-council-districts-2012.json';
import ncOverlay from '../../data/nc-boundary-2019-centroid.json';

document.getElementsByClassName('leaflet-container')[0].tabIndex = "=1"

const { BaseLayer, Overlay } = LayersControl;
const boundaryDefaultColor = COLORS.BRAND.MAIN;
const boundaryHighlightColor = COLORS.BRAND.CTA1;

const PrintControl = withLeaflet(PrintControlDefault);

class PinMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: [34.0094213, -118.6008506],
      zoom: 10,
      streetsLayerUrl: `${process.env.MAPBOX_STREETS_URL}?access_token=${process.env.MAPBOX_TOKEN}`,
      satelliteLayerUrl: `${process.env.MAPBOX_SATELLITE_URL}?access_token=${process.env.MAPBOX_TOKEN}`,
      geoJSON: ncOverlay,
      bounds: null,
      ready: false,
      width: null,
      height: null,
      markersVisible: true,
      heatmapVisible: false,
      zoomBreak: 14,
      zoomThresholdMet: false,
    };
    this.container = React.createRef();
  }

  componentDidMount() {
    this.setDimensions();
    this.setState({ ready: true });
    window.addEventListener('resize', this.setDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setDimensions);
  }

  setDimensions = () => {
    this.setState({
      width: this.container.current.offsetWidth,
      height: this.container.current.offsetHeight,
    });
  }

  highlightRegion = e => {
    const layer = e.target;

    layer.setStyle({
      weight: 5,
      color: boundaryHighlightColor,
    });

    layer.bringToFront();
  }

  resetRegionHighlight = e => {
    const layer = e.target;

    layer.setStyle({
      weight: 2,
      opacity: 1,
      color: boundaryDefaultColor,
    });
  }

  zoomToRegion = e => {
    const bounds = e.target.getBounds();
    this.setState({ bounds });
  }

  updatePosition = ({ target: map }) => {
    const { updatePosition } = this.props;
    const { zoomBreak } = this.state;
    const mapZoom = map.getZoom();
    updatePosition({
      zoom: mapZoom,
      bounds: map.getBounds(),
    });
    this.setState({ zoomThresholdMet: (mapZoom >= zoomBreak) });
  }

  onEachRegionFeatureMouseTooltip = (feature, layer) => {
    // Tooltip text when mousing over on a region
    const toolTipText = `
      <div class="nc-name-tooltip">
        <span class="nc-name">
          ${feature.properties.nameshort} NC
        </span>
        <br />
        ${feature.properties.service_re}
      </div>
    `;
    layer.bindTooltip(toolTipText);

    // Sets mouseover/out/click event handlers for each region
    layer.on({
      mouseover: this.highlightRegion,
      mouseout: this.resetRegionHighlight,
      click: this.zoomToRegion,
    });
  }

  onEachRegionFeatureLabelTooltip = (feature, layer) => {
    const { nameshort } = feature.properties;
    layer.bindTooltip(`${nameshort} NC`, {
      permanent: true,
      direction: 'center',
      className: 'overlay-nc-name',
    });
    layer.bringToBack();
    layer.on({
      mouseover: this.highlightRegion,
      mouseout: this.resetRegionHighlight,
      click: this.zoomToRegion,
    });
  }

  resizeNcNames = () => {
    const { zoomBreak } = this.state;
    const currentZoom = this.map.getZoom();
    if (currentZoom >= zoomBreak) {
      const names = document.getElementsByClassName('overlay-nc-name');
      const fontSizeScale = {
        14: '18px',
        15: '24px',
        16: '30px',
        17: '36px',
        18: '42px',
      };

      for (let i = 0; i < names.length; i += 1) {
        names[i].style.fontSize = fontSizeScale[currentZoom];
      }
    }
  }

  renderMarkers = () => {
    const {
      pinClusters,
      getPinInfo,
      pinsInfo,
    } = this.props;

    if (pinClusters) {
      return pinClusters.map(({
        id,
        count,
        latitude,
        longitude,
        expansion_zoom: expansionZoom,
        srnumber,
        requesttype,
      }) => {
        const position = [latitude, longitude];

        if (count > 1) {
          return (
            <ClusterMarker
              key={id}
              position={position}
              count={count}
              onClick={({ latlng }) => {
                this.map.flyTo(latlng, expansionZoom);
              }}
            />
          );
        }

        const {
          status,
          createddate,
          updateddate,
          closeddate,
          address,
          ncname,
        } = pinsInfo[srnumber] || {};
        const { displayName, color, abbrev } = REQUEST_TYPES[requesttype];

        const popup = (
          <PinPopup
            displayName={displayName}
            color={color}
            abbrev={abbrev}
            address={address}
            createdDate={createddate}
            updatedDate={updateddate}
            closedDate={closeddate}
            status={status}
            ncName={ncname}
          />
        );

        return (
          <CustomMarker
            key={srnumber}
            position={position}
            onClick={() => {
              if (!pinsInfo[srnumber]) {
                getPinInfo(srnumber);
              }
            }}
            color={color}
            icon="map-marker-alt"
            size="3x"
            style={{ textShadow: '1px 0px 3px rgba(0,0,0,1.0), -1px 0px 3px rgba(0,0,0,1.0)' }}
          >
            {popup}
          </CustomMarker>
        );
      });
    }
    return null;
  }

  renderMap = () => {
    const {
      position,
      zoom,
      streetsLayerUrl,
      satelliteLayerUrl,
      bounds,
      geoJSON,
      width,
      height,
      heatmapVisible,
      markersVisible,
      zoomThresholdMet,
    } = this.state;

    const { heatmap } = this.props;

    return (
      <>
        <Map
          center={position}
          zoom={zoom}
          maxZoom={18}
          bounds={bounds}
          style={{ width, height }}
          zoomControl={false}
          whenReady={e => {
            this.map = e.target;
            this.updatePosition(e);
          }}
          onMoveend={this.updatePosition}
          onOverlayadd={({ name }) => {
            if (name === 'Heatmap') {
              this.setState({ heatmapVisible: true });
            }
            if (name === 'Markers') {
              this.setState({ markersVisible: true });
            }
          }}
          onOverlayremove={({ name }) => {
            if (name === 'Heatmap') {
              this.setState({ heatmapVisible: false });
            }
            if (name === 'Markers') {
              this.setState({ markersVisible: false });
            }
          }}
          onZoomEnd={this.resizeNcNames}
        >
          <ZoomControl position="topright" />
          <ScaleControl position="bottomright" />
          <LayersControl
            position="bottomright"
            collapsed={false}
          >
            <BaseLayer checked name="Streets">
              <TileLayer
                url={streetsLayerUrl}
                attribution='<a href="https://www.mapbox.com/about/maps/">© Mapbox</a> | <a href="http://www.openstreetmap.org/about/">© OpenStreetMap</a> | <a href="https://www.mapbox.com/map-feedback/#/-74.5/40/10">Improve this map</a>'
                tileSize={512}
                zoomOffset={-1}
              />
            </BaseLayer>
            <BaseLayer name="Satellite">
              <TileLayer
                url={satelliteLayerUrl}
                attribution='<a href="https://www.mapbox.com/about/maps/">© Mapbox</a> | <a href="http://www.openstreetmap.org/about/">© OpenStreetMap</a> | <a href="https://www.mapbox.com/map-feedback/#/-74.5/40/10">Improve this map</a>'
                tileSize={512}
                zoomOffset={-1}
              />
            </BaseLayer>
            {
              (zoomThresholdMet === false && geoJSON)
              && (
                <Overlay checked name="Neighborhood Council Boundaries">
                  <Choropleth
                    data={geoJSON}
                    style={{
                      fillColor: 'transparent',
                      weight: 2,
                      color: boundaryDefaultColor,
                      dashArray: '3',
                    }}
                    onEachFeature={this.onEachRegionFeatureMouseTooltip}
                    ref={el => {
                      if (el) {
                        this.choropleth = el.leafletElement;
                        return this.choropleth;
                      }
                      return null;
                    }}
                  />
                </Overlay>
              )
            }
            {
              (zoomThresholdMet === true && geoJSON)
              && (
                <Overlay checked name="Neighborhood Council Boundaries">
                  <Choropleth
                    data={geoJSON}
                    style={{
                      fillColor: 'transparent',
                      weight: 2,
                      color: boundaryDefaultColor,
                      dashArray: '3',
                    }}
                    onEachFeature={this.onEachRegionFeatureLabelTooltip}
                    ref={el => {
                      if (el) {
                        this.choropleth = el.leafletElement;
                        return this.choropleth;
                      }
                      return null;
                    }}
                  />
                </Overlay>
              )
            }
            <Overlay checked name="Markers">
              <MarkerClusterGroup maxClusterRadius={0}>
                {this.renderMarkers()}
              </MarkerClusterGroup>
            </Overlay>
            <Overlay name="Heatmap">
              {/* intensityExtractor is required and requires a callback as the value.
                * The heatmap is working with an empty callback but we'll probably
                * improve functionality post-MVP by generating a heatmap list
                * on the backend. */}
              {/* The heatmapVisible test prevents the component from doing
                * unnecessary calculations when the heatmap isn't visible */}
              <HeatmapLayer
                max={1}
                points={heatmapVisible ? heatmap : []}
                radius={20}
                blur={25}
                longitudeExtractor={m => m[1]}
                latitudeExtractor={m => m[0]}
                intensityExtractor={() => 1}
              />
            </Overlay>
          </LayersControl>
          <ExportLegend visible={markersVisible} position="bottomright" />
          <HeatmapLegend visible={heatmapVisible} position="bottomright" />
          <PrintControl
            sizeModes={['Current']}
            hideControlContainer={false}
            exportOnly
          />
        </Map>
        <Button
          id="map-export"
          label="Export"
          handleClick={() => {
            const { exportMap } = this.props;
            const selector = '.leaflet-control-easyPrint .CurrentSize';
            const link = document.body.querySelector(selector);
            if (link) link.click();
            exportMap();
          }}
          tabIndex="0"
        />
        <MapboxWordmark />
      </>
    );
  }

  render() {
    const { ready } = this.state;
    return (
      <div ref={this.container} className="map-container">
        { ready ? this.renderMap() : null}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getPinInfo: srnumber => dispatch(getPinInfoRequest(srnumber)),
  updatePosition: position => dispatch(updateMapPosition(position)),
  exportMap: () => dispatch(trackMapExport()),
});

const mapStateToProps = state => ({
  pinsInfo: state.data.pinsInfo,
  pinClusters: state.data.pinClusters,
  heatmap: state.data.heatmap,
});

PinMap.propTypes = {
  pinsInfo: PropTypes.shape({}),
  pinClusters: PropTypes.arrayOf(PropTypes.shape({})),
  heatmap: PropTypes.arrayOf(PropTypes.array),
  getPinInfo: PropTypes.func.isRequired,
  updatePosition: PropTypes.func.isRequired,
  exportMap: PropTypes.func.isRequired,
};

PinMap.defaultProps = {
  pinsInfo: {},
  pinClusters: [],
  heatmap: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(PinMap);
