import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'proptypes';

import Icon from '@components/common/Icon';
import Button from '@components/common/Button';
import Dropdown from '@components/common/Dropdown';
import {
  DISTRICT_TYPES,
} from '@components/common/CONSTANTS';
import { updateComparisonDistrict } from '@reducers/filters';

import NCSelector from '../NCSelector';

const DistrictSelectorModal = ({
  set,
  closeModal,
  updateDistrict,
  comparison,
}) => {
  const mungeDistrictTypes = () => DISTRICT_TYPES.map(district => ({
    label: district,
    value: district.split(' ')[0].toLowerCase(),
  }));

  const renderSelector = () => {
    switch (comparison[set].district) {
      case 'neighborhood':
        return <NCSelector />;
      case 'city':
        return 'City Selector';
      default:
        return null;
    }
  };

  return (
    <div className="district-selector-modal-content">
      <div
        className="card"
        style={{
          padding: '35px',
          width: '417px',
          height: '550px',
        }}
      >
        <div className="level">
          <div className="level-left">
            <p className="subtitle">
              District Selection
            </p>
          </div>
          <div className="level-right">
            <Icon
              id="district-selector-modal-close"
              icon="times"
              handleClick={closeModal}
            />
          </div>
        </div>
        <Dropdown
          list={mungeDistrictTypes()}
          onClick={district => updateDistrict(set, district)}
        />
        <br />
        {renderSelector()}
        <br />
        <div className="has-text-centered">
          <Button
            id="district-selector-submit"
            label="Submit"
            color="warning"
            handleClick={closeModal}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  comparison: state.filters.comparison,
});

const mapDispatchToProps = dispatch => ({
  updateDistrict: (set, district) => dispatch(updateComparisonDistrict(set, district)),
});

DistrictSelectorModal.propTypes = {
  closeModal: propTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(DistrictSelectorModal);
