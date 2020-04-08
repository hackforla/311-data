import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'proptypes';

import Icon from '@components/common/Icon';
import Button from '@components/common/Button';
import Dropdown from '@components/common/Dropdown';
import {
  DISTRICT_TYPES,
} from '@components/common/CONSTANTS';
import { updateComparisonDistrict } from '@reducers/comparisonFilters';

import DistrictSelectorDropdown from './DistrictSelectorDropdown';

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
          id="district-selector-dropdown"
          title="Select District Type"
          list={mungeDistrictTypes()}
          onClick={districtId => updateDistrict(set, districtId)}
        />
        <br />
        {comparison[set].district && (
          <DistrictSelectorDropdown district={comparison[set].district} set={set} />
        )}
        <br />
        <div className="has-text-centered">
          <Button
            id="district-selector-submit"
            label="Select"
            handleClick={closeModal}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  comparison: state.comparisonFilters.comparison,
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
