import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import {
  updateRequestType,
  selectAllRequestTypes,
  deselectAllRequestTypes,
} from '../../../redux/reducers/filters';

import Checkbox from '../../common/Checkbox';
import Icon from '../../common/Icon';
import HoverOverInfo from '../../common/HoverOverInfo';

import { REQUEST_TYPES } from '../../common/CONSTANTS';
import COLORS from '../../../styles/COLORS';

const typeContainerStyle = {
  padding: '2px 0 2px 0',
  fontSize: '14px',
};

const checkboxStyle = {
  display: 'inline-block',
  paddingRight: '3px',
  paddingLeft: '3px',
};

const types = Object.keys(REQUEST_TYPES);

const midIndex = (list => {
  if (list.length / 2 === 0) {
    return (list.length / 2);
  }
  return Math.floor(list.length / 2);
})(types);

const leftColumnItems = types.slice(0, midIndex);
const rightColumnItems = types.slice(midIndex);

const RequestItem = ({
  type,
  displayName,
  abbrev,
  selected,
  color,
  handleClick,
}) => (
  <div
    id={`request-type-${type}`}
    value={type}
    style={typeContainerStyle}
  >
    <span
      style={checkboxStyle}
    >
      <Checkbox
        id={`request-checkbox-${type}`}
        value={type}
        size="small"
        style={{ paddingLeft: '10px' }}
        checked={selected}
        handleClick={handleClick}
      />
      <Icon
        id={`request-icon-${type}`}
        icon="circle"
        size="small"
        style={{ color }}
      />
    </span>
    <span>
      {`${displayName} [${abbrev}]`}
    </span>
  </div>
);

const RequestTypeSelector = ({
  requestTypes,
  selectType,
  selectAll,
  deselectAll,
}) => {
  const handleItemClick = e => {
    const type = e.target.value;
    selectType(type);
  };

  const renderRequestItems = items => items.map(type => {
    const item = REQUEST_TYPES[type];
    return (
      <RequestItem
        key={type}
        type={type}
        displayName={item.displayName}
        abbrev={item.abbrev}
        handleClick={handleItemClick}
        selected={requestTypes[type]}
        color={item.color}
      />
    );
  });

  return (
    <div id="type-selector-container" style={{ color: COLORS.FONTS }}>
      {/* ---------- Title ---------- */}
      <div
        className="type-selector-title"
        style={{ paddingBottom: '15px', paddingTop: '15px' }}
      >
        <span
          className="has-text-weight-bold is-size-6"
          style={{ paddingRight: '10px' }}
        >
          Request Type Selection
        </span>
        <HoverOverInfo
          title="Request Type Selection"
          text="This filter allows the user to choose specific 311 data types."
        >
          <Icon
            id="type-selector-info-icon"
            icon="info-circle"
            size="small"
          />
        </HoverOverInfo>
      </div>
      <div className="columns is-0" style={{ width: '475px' }}>
        <div className="column" style={{ paddingRight: '8px' }}>
          {/* ---------- Select/Deselect All ---------- */}
          <div
            id="request-type-all"
            value="all"
            style={typeContainerStyle}
          >
            <span style={checkboxStyle}>
              <Checkbox
                id="request-checkbox-all"
                value="all"
                size="small"
                style={{ paddingLeft: '10px' }}
                handleClick={requestTypes.All ? deselectAll : selectAll}
                checked={requestTypes.All}
              />
            </span>
            <span className="has-text-weight-medium">
              Select/Deselect All
            </span>
          </div>
          { renderRequestItems(leftColumnItems) }
        </div>
        <div className="column" style={{ paddingLeft: '8px' }}>
          { renderRequestItems(rightColumnItems) }
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  requestTypes: state.filters.requestTypes,
});

const mapDispatchToProps = dispatch => ({
  selectType: type => dispatch(updateRequestType(type)),
  selectAll: () => dispatch(selectAllRequestTypes()),
  deselectAll: () => dispatch(deselectAllRequestTypes()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RequestTypeSelector);

RequestItem.propTypes = {
  type: PropTypes.string,
  displayName: PropTypes.string,
  abbrev: PropTypes.string,
  color: PropTypes.string,
  selected: PropTypes.bool,
  handleClick: PropTypes.func,
};

RequestItem.defaultProps = {
  type: null,
  displayName: null,
  abbrev: null,
  color: null,
  selected: false,
  handleClick: () => null,
};

RequestTypeSelector.propTypes = {
  requestTypes: PropTypes.shape({
    All: PropTypes.bool,
  }),
  selectType: PropTypes.func,
  selectAll: PropTypes.func,
  deselectAll: PropTypes.func,
};

RequestTypeSelector.defaultProps = {
  requestTypes: null,
  selectType: () => null,
  selectAll: () => null,
  deselectAll: () => null,
};
