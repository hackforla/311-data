import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'proptypes';

import Button from '@components/common/Button';
import Dropdown from '@components/common/Dropdown';

const DistrictSelectorModal = ({ closeModal }) => (
  <div className="district-selector-modal-content">
    <div className="container">
      <p className="subtitle">
        District Selection
      </p>
      <Dropdown list={[]} />
      <br />
      <Dropdown list={[]} />
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

DistrictSelectorModal.propTypes = {
  closeModal: propTypes.func.isRequired,
};

export default connect(null, null)(DistrictSelectorModal);
