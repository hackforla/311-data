import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'proptypes';

import { setErrorModal } from '@reducers/ui';

import Icon from '@components/common/Icon';
import Button from '@components/common/Button';

const DataRequestError = ({ closeModal }) => (
  <div className="data-request-error">
    <div className="has-text-centered">
      <Icon
        id="data-request-error-icon"
        icon="exclamation-triangle"
        color="warning"
        size="large"
        iconSize="3x"
      />
    </div>
    <br />
    <p className="has-text-centered has-text-weight-bold is-size-4">
      Something went wrong
    </p>
    <br />
    <p className="has-text-centered">
      We failed to retrieve data for this request; please try again.
    </p>
    <br />
    <div className="has-text-centered">
      <Button
        id="data-request-back-button"
        label="Back"
        color="danger"
        handleClick={closeModal}
      />
    </div>
  </div>
);

DataRequestError.propTypes = {
  closeModal: propTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(setErrorModal(false)),
});

export default connect(null, mapDispatchToProps)(DataRequestError);
