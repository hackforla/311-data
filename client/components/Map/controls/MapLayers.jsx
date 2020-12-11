/* eslint-disable */

import React from 'react';
import PropTypes from 'proptypes';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import { COLOR_SCHEME_NAMES, getColors } from '../mapColors';
import { MAP_STYLES } from '../constants';
import clx from 'classnames';

const TABS = [
  'Legend',
  'Style'
];

class MapLayers extends React.Component {
  state = {
    activeTab: TABS[0]
  };

  onToggleType = id => {
    const { selectedTypes, onChangeSelectedTypes } = this.props;

    const newTypes = selectedTypes.includes(id)
      ? selectedTypes.filter(t => t !== id)
      : [ ...selectedTypes, id ];

    onChangeSelectedTypes(newTypes);
  }

  selectAll = () => {
    this.props.onChangeSelectedTypes(Object.keys(REQUEST_TYPES));
  }

  deselectAll = () => {
    this.props.onChangeSelectedTypes([]);
  }

  setTab = tab => {
    if (tab !== this.state.activeTab)
      this.setState({ activeTab: tab });
  }

  onChangeStyle = styleId => {
    const { mapStyle, onChangeMapStyle } = this.props;
    if (mapStyle !== styleId)
      onChangeMapStyle(styleId);
  }

  onChangeColorScheme = scheme => {
    const { colorScheme, onChangeColorScheme } = this.props;
    if (colorScheme !== scheme)
      onChangeColorScheme(scheme);
  }

  render() {
    const {
      selectedTypes,
      requestsLayer,
      onChangeRequestsLayer,
      colorScheme,
      mapStyle,
    } = this.props;

    const schemeColors = getColors(colorScheme);

    return (
      <div className="map-layers map-control">
        <div className="map-control-tabs">
          { TABS.map(tab => (
            <div
              key={tab}
              className={clx('map-control-tab', {
                active: tab === this.state.activeTab
              })}
              onClick={this.setTab.bind(null, tab)}
            >
              { tab }
            </div>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <div className="type-selection">
            <div className="type-selectors">
              { Object.keys(REQUEST_TYPES).map(id => {
                const type = REQUEST_TYPES[id];
                // const selected = selectedTypes.includes(id);
                return (
                  <div
                    key={id}
                    className="type-selector"
                    onClick={this.onToggleType.bind(this, id)}>
                    <div
                      className="type-color"
                      style={{
                        // backgroundColor: selected ? schemeColors[id] : 'transparent',
                        // borderWidth: selected ? 0 : 1,
                        backgroundColor: 'transparent',
                        borderWidth: 1,
                      }}
                    />
                    <div className="type-name">{ type.displayName }</div>
                  </div>
                );
              })}
            </div>
            <div className="type-selector-buttons">
              <div
                className="type-selector-button"
                onClick={this.selectAll}>
                Select All
              </div>
              <div
                className="type-selector-button"
                onClick={this.deselectAll}>
                Clear All
              </div>
            </div>
          </div>
          { this.state.activeTab === 'Style' && (
            <div className="style-selection">
              <div className="type-selectors">
                <div className="type-selectors-heading">Map Style</div>
                { Object.keys(MAP_STYLES).map(styleId => {
                  const selected = mapStyle === styleId;
                  return (
                    <div
                      key={styleId}
                      className="type-selector"
                      onClick={this.onChangeStyle.bind(this, styleId)}>
                      <div
                        className="type-color"
                        style={{
                          backgroundColor: selected ? 'white' : 'transparent',
                          borderWidth: selected ? 0 : 1,
                        }}
                      />
                      <div className="type-name">{ styleId }</div>
                    </div>
                  );
                })}
              </div>
              <div className="type-selectors">
                <div className="type-selectors-heading">Color Scheme</div>
                { COLOR_SCHEME_NAMES.map(scheme => {
                  const selected = colorScheme === scheme;
                  return (
                    <div
                      key={scheme}
                      className={clx('type-selector', { selected })}
                      onClick={this.onChangeColorScheme.bind(this, scheme)}>
                      <div className="type-color" />
                      <div className="type-name">{ scheme }</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="request-layer-selection">
          <div
            className={clx('layer-selector-button', {
              active: requestsLayer === 'points'
            })}
            onClick={() => onChangeRequestsLayer('points')}>
            Points
          </div>
          <div
            className={clx('layer-selector-button', {
              active: requestsLayer === 'heatmap'
            })}
            onClick={() => onChangeRequestsLayer('heatmap')}>
            Heatmap
          </div>
        </div>
      </div>
    );
  }
};

MapLayers.propTypes = {};

MapLayers.defaultProps = {};

export default MapLayers;
