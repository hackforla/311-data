import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPinInfoRequest } from '@reducers/data';
import { updateMapPosition } from '@reducers/ui';
import PinPopup from '@components/PinMap/PinPopup';
import CustomMarker from '@components/PinMap/CustomMarker';
import ClusterMarker from '@components/PinMap/ClusterMarker';
import {
  Map,
  TileLayer,
  Rectangle,
  Tooltip,
  LayersControl,
  LayerGroup,
  ZoomControl,
  withLeaflet,
} from 'react-leaflet';
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
import ncOverlay from '../../data/nc-boundary-2019.json';

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
      mapUrl: `https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`,
      satelliteUrl: `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`,
      geoJSON: ncOverlay,
      bounds: null,
      ready: false,
      width: null,
      height: null,
      heatmapVisible: false,
        zoomBreak: 12,
        zoomThresholdMet:false,
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
    updatePosition({
      zoom: map.getZoom(),
      bounds: map.getBounds(),
    });
    this.setState({ zoom: map.getZoom() });
  }

  onEachRegionFeature = (feature, layer) => {
    // Popup text when clicking on a region
    // Updating to tooltip on hover
    const toolTipText = `
      <div class="overlay_feature_popup">
        ${feature.properties.name}
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

    const tooltipPosition = [[34.0173157, -118.2497254], [34.1, -118.1497254]];

    return (
      <Rectangle bounds={tooltipPosition} color="black">
        <Tooltip
          permanent
          direction="top"
          offset={[0, 20]}
          opacity={1}
        >
          No Data To Display
        </Tooltip>
      </Rectangle>
    );
  }

  renderMap = () => {
    const {
      position,
      zoom,
      mapUrl,
      satelliteUrl,
      bounds,
      geoJSON,
      width,
      height,
      heatmapVisible,
        zoomBreak,
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
          }}
          onOverlayremove={({ name }) => {
            if (name === 'Heatmap') {
              this.setState({ heatmapVisible: false });
            }
          }}
            //Need to get current zoom level, "Zoom" is the default level when loading
            onZoomEnd={({ zoom }) => {
            if (zoom => this.zoomBreak) {
                this.setState({zoomThresholdMet: true});
            }
            }}
            onZoomEnd={({ zoom }) => {
            if (zoom < this.zoomBreak) {
                this.setState({zoomThresholdMet: false});
            }}
            }
        >
          <ZoomControl position="topright" />
          <LayersControl
            position="bottomright"
            collapsed={false}
          >
            <BaseLayer checked name="Streets">
              <TileLayer
                url={mapUrl}
                attribution="MapBox"
              />
            </BaseLayer>
            <BaseLayer name="Satellite">
              <TileLayer
                url={satelliteUrl}
                attribution="MapBox"
              />
            </BaseLayer>
            {
              geoJSON
              && (
                <Overlay checked name="Neighborhood Council Boundaries">
                  <Choropleth
                    data={geoJSON}
                    style={{
                      fillColor: 'white',
                      weight: 2,
                      opacity: 1,
                      color: boundaryDefaultColor,
                      dashArray: '3',
                    }}
                    //Try defining state based on zoom level and changing function based on state
                    onEachFeature={this.onEachRegionFeature}
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
              <LayerGroup>
                {this.renderMarkers()}
              </LayerGroup>
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
            const selector = '.leaflet-control-easyPrint .CurrentSize';
            const link = document.body.querySelector(selector);
            if (link) link.click();
          }}
        />
        <div className="heatmap-legend-wrapper has-text-centered">
          Concentration of Reports (Heatmap)
          <div id="heatmap-gradient-legend" className="level">
            <span className="level-left">
              Low
            </span>
            <span className="level-right">
              High
            </span>
          </div>
        </div>
      </>
    );
  }

  render() {
    const { ready } = this.state;

    return (
      <div ref={this.container} className="map-container">
        { ready ? this.renderMap() : null }
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  getPinInfo: srnumber => dispatch(getPinInfoRequest(srnumber)),
  updatePosition: position => dispatch(updateMapPosition(position)),
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
};

PinMap.defaultProps = {
  pinsInfo: {},
  pinClusters: [],
  heatmap: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(PinMap);
