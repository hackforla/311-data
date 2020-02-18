import React from 'react';
import PropTypes from 'proptypes';
import Checkbox from '../../common/Checkbox';
import Icon from '../../common/Icon';

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

const RequestItem = ({
  type,
  abbrev,
  color,
}) => (
  <div
    id={`request-type-${type}`}
    value={abbrev}
    style={typeContainerStyle}
  >
    <span style={checkboxStyle}>
      <Checkbox
        id={`request-checkbox-${type}`}
        value={abbrev}
        size="small"
        style={{ paddingLeft: '10px' }}
      />
      <Icon
        id={`request-icon-${type}`}
        icon="circle"
        size="small"
        style={{ color }}
      />
    </span>
    <span>
      {`${type} [${abbrev}]`}
    </span>

  </div>
);


const RequestTypeSelector = () => {
  const midIndex = ((list) => {
    if (list.length / 2 === 0) {
      return (list.length / 2);
    }
    return Math.floor(list.length / 2);
  })(REQUEST_TYPES);

  const leftColumnItems = REQUEST_TYPES.slice(0, midIndex);
  const rightColumnItems = REQUEST_TYPES.slice(midIndex);

  const renderRequestItems = (items) => items.map((item) => (
    <RequestItem
      key={item.type}
      type={item.type}
      abbrev={item.abbrev}
      color={item.color}
    />
  ));

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
        <Icon
          id="type-selector-info-icon"
          icon="info-circle"
          size="small"
        />
      </div>
      <div className="columns is-0" style={{ width: '475px' }}>
        <div className="column" style={{ paddingRight: '8px' }}>
          {/* ---------- Select/Deselect All ---------- */}
          <div
            id="request-type-all"
            value="all"
            style={typeContainerStyle}
          >
            <span
              style={checkboxStyle}
            >
              <Checkbox
                id="request-checkbox-all"
                value="all"
                size="small"
                style={{ paddingLeft: '10px' }}
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

export default RequestTypeSelector;

RequestItem.propTypes = {
  type: PropTypes.string,
  abbrev: PropTypes.string,
  color: PropTypes.string,
};

RequestItem.defaultProps = {
  type: null,
  abbrev: null,
  color: null,
};

RequestTypeSelector.propTypes = {

};

RequestTypeSelector.defaultProps = {

};
