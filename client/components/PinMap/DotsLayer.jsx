import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'proptypes';
import { renderToString } from 'react-dom/server';
import { connect } from 'react-redux';
import { getPinInfoRequest } from '@reducers/data';
import moment from 'moment';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';

import { useLeaflet } from 'react-leaflet';
import * as PIXI from 'pixi.js';
import 'leaflet-pixi-overlay';
import L from 'leaflet';

PIXI.utils.skipHello();

// Disable adaptive points to smooth circle edges at high zoom
PIXI.GRAPHICS_CURVES.adaptive = false;

const PIXILoader = PIXI.Loader.shared;
const pixiContainer = new PIXI.Container();

const DotsLayer = ({
  markers,
  pinsInfo,
  getPinInfo,
}) => {
  const isInitialMount = useRef(true);
  const isFirstDraw = useRef(true);
  const circleGraphics = useRef({});
  const [pixiOverlay, setPixiOverlay] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [activePopup, setActivePopup] = useState();
  const { map } = useLeaflet();

  const createBaseDot = color => {
    const circleColor = parseInt(Number(color.replace('#', '0x')), 10);

    const circle = new PIXI.Graphics();
    circle.lineStyle(1, circleColor, 1, 1, true);
    circle.beginFill(circleColor, 1);
    circle.arc(0, 0, 0.1, 0, 2 * Math.PI);
    circle.endFill();

    return circle;
  };

  const openPopupWithData = data => {
    const {
      requesttype,
      latitude,
      longitude,
      status,
      createddate,
      updateddate,
      closeddate,
      address,
      ncname,
    } = data;
    const position = [latitude, longitude];
    const { displayName, color, abbrev } = REQUEST_TYPES[requesttype];

    const popup = L.popup()
      .setLatLng(position)
      .setContent(
        renderToString(
          <>
            <p className="pin-popup-type has-text-weight-bold">
              {displayName}
              &nbsp;
              [
              <span className="pin-popup-type-abbrev" style={{ color }}>
                {abbrev}
              </span>
              ]
            </p>
            <p className="pin-popup-ncname">{ncname}</p>
            <p className="pin-popup-address has-text-weight-bold">{address}</p>
            <div className="pin-popup-status">
              <p>
                Reported on&nbsp;
                {moment.unix(createddate).format('l')}
              </p>
              {
                closeddate ? (
                  <p>
                    Closed on&nbsp;
                    {moment.unix(closeddate).format('l')}
                  </p>
                ) : (
                  <>
                    <p>
                      Last updated on&nbsp;
                      {moment.unix(updateddate).format('l')}
                    </p>
                    <p>
                      Status:&nbsp;
                      {status}
                    </p>
                  </>
                )
              }
            </div>
          </>,
        ),
      )
      .openOn(map);

    return popup;
  };

  // Load pixi overlay on the map
  useEffect(() => {
    const overlay = L.pixiOverlay(utils => {
      utils.getRenderer().render(utils.getContainer());
    }, pixiContainer);

    overlay.addTo(map);
    setPixiOverlay(overlay);

    return () => pixiContainer.removeChildren();
  }, [map]);

  // Add all base dot graphics to cache the first time this component mounts
  useEffect(() => {
    if (isInitialMount.current) {
      let loadingAny = false;
      Object.values(REQUEST_TYPES).forEach(type => {
        const { color, abbrev } = type;
        loadingAny = true;
        circleGraphics.current[abbrev] = createBaseDot(color);
      });

      if (loaded && loadingAny) {
        setLoaded(false);
      }

      if (loadingAny) {
        PIXILoader.load(() => setLoaded(true));
      } else {
        setLoaded(true);
      }
    }
  }, [pixiOverlay, loaded]);

  // Draw markers first time in new container
  useEffect(() => {
    if (pixiOverlay && markers && loaded) {
      const { utils } = pixiOverlay;
      const container = utils.getContainer();
      const renderer = utils.getRenderer();
      const project = utils.latLngToLayerPoint;

      if (isFirstDraw.current) {
        const { plugins: { interaction } } = renderer;
        utils.getMap().on('click', e => {
          const pointerEvent = e.originalEvent;
          const pixiPoint = new PIXI.Point();
          interaction.mapPositionToPoint(pixiPoint, pointerEvent.clientX, pointerEvent.clientY);
          const target = interaction.hitTest(pixiPoint, container);

          if (target && target.popupData) {
            setActivePopup(target.popupData);
            target.popup.openOn(map);
          }

          if (!pinsInfo[target.popupData.srnumber]) {
            getPinInfo(target.popupData.srnumber);
          }
        });
      }

      markers.forEach(marker => {
        const {
          srnumber, requesttype, latitude, longitude,
        } = marker;
        const { abbrev } = REQUEST_TYPES[requesttype];
        const position = [latitude, longitude];

        const circleGraphic = circleGraphics.current[abbrev];

        // Clone cached circle graphic geometry/fill to avoid GPU memory leak
        const circleClone = circleGraphic.clone();
        const projectedCenter = project(position);

        circleClone.x = projectedCenter.x;
        circleClone.y = projectedCenter.y;

        circleClone.popupData = { srnumber, position };
        circleClone.popup = L.popup()
                        .setLatLng(position)
                        .setContent(renderToString(
                          <>
                            <div className="loader" />
                            <p>Loading...</p>
                          </>,
                        ));

        circleClone.on('click', () => {
          if (!pinsInfo[srnumber]) {
            getPinInfo(srnumber);
          }
        });

        circleClone.interactive = true;
        container.addChild(circleClone);
      });

      isFirstDraw.current = false;
      container.interactive = true;
      container.buttonMode = true;
      renderer.render(container);
    }

    return () => pixiOverlay && pixiOverlay.utils.getContainer().removeChildren();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pixiOverlay, markers, loaded]);

  // Handle popup after pinInfo is fetched
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      map.closePopup();
      openPopupWithData(pinsInfo[activePopup.srnumber]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinsInfo, map]);

  return null;
};

const mapDispatchToProps = dispatch => ({
  getPinInfo: srnumber => dispatch(getPinInfoRequest(srnumber)),
});

const mapStateToProps = state => ({
  pinsInfo: state.data.pinsInfo,
});

DotsLayer.propTypes = {
  pinsInfo: PropTypes.shape({}).isRequired,
  getPinInfo: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(DotsLayer);
