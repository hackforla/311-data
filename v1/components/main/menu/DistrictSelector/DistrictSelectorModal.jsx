import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'proptypes';

import { DISTRICT_TYPES } from '@components/common/CONSTANTS';
import { updateComparisonDistrict, clearComparisonSet } from '@reducers/comparisonFilters';
import Icon from '@components/common/Icon';
import Button from '@components/common/Button';
import Dropdown from '@components/common/Dropdown';
import NCSelector from '@components/main/menu/NCSelector';
import CCSelector from '@components/main/menu/CCSelector';

const DistrictSelectorModal = ({
  set,
  closeModal,
  updateDistrict,
  clearSet,
  comparison,
}) => {
  const mungeDistrictTypes = () => DISTRICT_TYPES.map(district => ({
    label: district.name,
    value: district.id,
  }));

  const { district } = comparison[set];

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
          <div
            className="level-right"
            tabIndex="0"
            role="button"
            onKeyUp={e => { if (e.key === 'Enter' || e.key === ' ') { closeModal(); } }}
          >
            <Icon
              id="district-selector-modal-close"
              icon="times"
              handleClick={() => {
                if (district) clearSet(set);
                closeModal();
              }}
            />
          </div>
        </div>
        <Dropdown
          id="district-selector-dropdown"
          title="Select District Type"
          list={mungeDistrictTypes()}
          onClick={districtId => {
            if (district) clearSet(set);
            updateDistrict(set, districtId);
          }}
          style={{ marginBottom: 30 }}
        />
        {(() => {
          switch (district) {
            case 'nc': return <NCSelector comparison set={set} />;
            case 'cc': return <CCSelector set={set} />;
            default: return null;
          }
        })()}
        <br />
        {district && (
          <div className="has-text-centered">
            <Button
              id="district-selector-submit"
              label="Select"
              handleClick={closeModal}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  comparison: state.comparisonFilters.comparison,
});

const mapDispatchToProps = dispatch => ({
  updateDistrict: (set, district) => dispatch(updateComparisonDistrict(set, district)),
  clearSet: set => dispatch(clearComparisonSet(set)),
});

DistrictSelectorModal.propTypes = {
  updateDistrict: propTypes.func.isRequired,
  clearSet: propTypes.func.isRequired,
  closeModal: propTypes.func.isRequired,
  comparison: propTypes.shape({}).isRequired,
  set: propTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(DistrictSelectorModal);
