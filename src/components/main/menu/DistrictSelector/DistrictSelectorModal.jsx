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
    label: district.name,
    value: district.id,
  }));

  const renderSelector = () => {
    switch (comparison[set].district) {
      case 'nc':
        return <NCSelector />;
      case 'cc':
        return 'City Selector';
      case 'bid':
        return 'Business Improvement District';
      case 'sd':
        return 'Supervisory District';
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
          onClick={districtId => updateDistrict(set, districtId)}
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
  updateDistrict: propTypes.func.isRequired,
  closeModal: propTypes.func.isRequired,
  comparison: propTypes.shape({}).isRequired,
  set: propTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(DistrictSelectorModal);
