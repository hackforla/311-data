import React from 'react';
import PropTypes from 'proptypes';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import { COLOR_SCHEME_NAMES, getColors } from '../mapColors';
import clx from 'classnames';

const TABS = [
  'legend',
  'style'
];

class MapLayers extends React.Component {
  state = {
    activeTab: 'legend'
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

  onChangeStyle = style => {
    this.props.onChangeMapStyle(style);
  }

  onChangeColorScheme = scheme => {
    this.props.onChangeColorScheme(scheme);
  }

  render() {
    const {
      selectedTypes,
      requestsLayer,
      onChangeRequestsLayer,
      colorScheme
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
                const selected = selectedTypes.includes(id);
                return (
                  <div
                    key={id}
                    className="type-selector"
                    onClick={this.onToggleType.bind(this, id)}>
                    <div
                      className="type-color"
                      style={{
                        backgroundColor: selected ? schemeColors[id] : 'transparent',
                        borderWidth: selected ? 0 : 1,
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
          { this.state.activeTab === 'style' && (
            <div className="style-selection">
              <div className="type-selectors">
                { COLOR_SCHEME_NAMES.map(scheme => {
                  const selected = this.props.colorScheme === scheme;
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
              {/*<div style={{
                height: 1,
                backgroundColor: 'white',
                margin: '10px 0',
              }} />
              <div className="type-selectors">
                { this.props.mapStyles.map(style => {
                  const selected = this.props.mapStyle === style;
                  return (
                    <div
                      key={style}
                      className="type-selector"
                      onClick={this.onChangeStyle.bind(this, style)}>
                      <div
                        className="type-color"
                        style={{
                          backgroundColor: selected ? 'white' : 'transparent',
                          borderWidth: selected ? 0 : 1,
                        }}
                      />
                      <div className="type-name">{ style }</div>
                    </div>
                  );
                })}
              </div>*/}
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
