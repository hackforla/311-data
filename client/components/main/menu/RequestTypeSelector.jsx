import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import {
  updateRequestType,
  selectAllRequestTypes,
  deselectAllRequestTypes,
} from '@reducers/filters';
import {
  updateComparisonRequestType,
  selectAllComparisonRequestTypes,
  deselectAllComparisonRequestTypes,
} from '@reducers/comparisonFilters';

import Checkbox from '../../common/Checkbox';
import Icon from '../../common/Icon';

import { REQUEST_TYPES } from '../../common/CONSTANTS';
import COLORS from '../../../styles/COLORS';

const typeContainerStyle = {
  padding: '1px 0',
  fontSize: '14px',
};

const checkboxStyle = {
  display: 'inline-block',
  paddingRight: '3px',
  paddingLeft: '3px',
};

const checkboxLabelDisplayStyle = {
  fontSize: '14px',
  display: 'table-cell',
};

const allRequestsLabelStyle = {
  fontSize: '14px',
  fontWeight: 'bolder',
  display: 'inline-block',
  margin: '0',
  paddingTop: '0',
  paddingBottom: '0',
};

const labelTextStyle = {
  display: 'block',
  maxWidth: '160px',
  marginLeft: '18px',
  marginTop: '-20px',
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
        checked={selected}
        handleClick={handleClick}
        ariaLabel={`${displayName}`}
        label={(
          <span style={checkboxLabelDisplayStyle}>
            <Icon
              id={`request-icon-${type}`}
              icon="circle"
              size="small"
              style={{ color }}
            />
            <span style={labelTextStyle}>
              {`${displayName} [${abbrev}]`}
            </span>
          </span>
        )}
      />
    </span>
  </div>
);

const RequestTypeSelector = ({
  comparison,
  requestTypes,
  comparisonRequestTypes,
  selectType,
  selectAll,
  deselectAll,
  selectComparisonType,
  selectAllComparison,
  deselectAllComparison,
}) => {
  const handleItemClick = e => {
    const dispatchSelect = comparison ? selectComparisonType : selectType;
    const type = e.target.value;
    dispatchSelect(type);
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
        selected={comparison ? comparisonRequestTypes[type] : requestTypes[type]}
        color={item.color}
      />
    );
  });

  const handleSelectAll = () => {
    const requests = comparison ? comparisonRequestTypes : requestTypes;
    const dispatchSelectAll = comparison ? selectAllComparison : selectAll;
    const dispatchDeselectAll = comparison ? deselectAllComparison : deselectAll;

    return (requests.All ? dispatchDeselectAll : dispatchSelectAll);
  };

  return (
    <div id="type-selector-container" style={{ color: COLORS.FONTS }}>
      <div className="columns is-gapless" style={{ width: '475px' }}>
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
                style={allRequestsLabelStyle}
                handleClick={handleSelectAll()}
                checked={comparison ? comparisonRequestTypes.All : requestTypes.All}
                label="Select/Deselect All"
                ariaLabel="select/deselect all request types"
              />
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
  comparisonRequestTypes: state.comparisonFilters.requestTypes,
});

const mapDispatchToProps = dispatch => ({
  selectType: type => dispatch(updateRequestType(type)),
  selectAll: () => dispatch(selectAllRequestTypes()),
  deselectAll: () => dispatch(deselectAllRequestTypes()),
  selectComparisonType: type => dispatch(updateComparisonRequestType(type)),
  selectAllComparison: () => dispatch(selectAllComparisonRequestTypes()),
  deselectAllComparison: () => dispatch(deselectAllComparisonRequestTypes()),
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
  comparisonRequestTypes: PropTypes.shape({
    All: PropTypes.bool,
  }),
  selectType: PropTypes.func.isRequired,
  selectAll: PropTypes.func.isRequired,
  deselectAll: PropTypes.func.isRequired,
  selectComparisonType: PropTypes.func.isRequired,
  selectAllComparison: PropTypes.func.isRequired,
  deselectAllComparison: PropTypes.func.isRequired,
  comparison: PropTypes.bool,
};

RequestTypeSelector.defaultProps = {
  requestTypes: null,
  comparisonRequestTypes: null,
  comparison: false,
};
