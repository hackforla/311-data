import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';

import { showFeedbackSuccess } from '@reducers/ui';

import Icon from '@components/common/Icon';
import Button from '@components/common/Button';

const SuccessPopup = ({
  showSuccess,
  message,
  header,
  onClick,
}) => (
  <div className="contact-success-popup">
    <div className="has-text-centered">
      <Icon
        id="contact-success-popup-icon"
        icon="check-circle"
        color="success"
        size="large"
        iconSize="3x"
      />
    </div>
    <br />
    <p className="has-text-centered has-text-weight-bold is-size-5">
      { header }
    </p>
    <br />
    <p className="has-text-centered">
      { message }
    </p>
    <br />
    <div className="has-text-centered">
      <Button
        id="contact-success-button"
        label="OK"
        color="success"
        handleClick={() => {
          showSuccess(false);
          onClick();
        }}
      />
    </div>
  </div>
);

SuccessPopup.propTypes = {
  showSuccess: PropTypes.func.isRequired,
  header: PropTypes.string,
  message: PropTypes.string,
  onClick: PropTypes.func,
};

SuccessPopup.defaultProps = {
  header: undefined,
  message: undefined,
  onClick: () => {},
};

const mapDispatchToProps = dispatch => ({
  showSuccess: bool => dispatch(showFeedbackSuccess(bool)),
});

export default connect(null, mapDispatchToProps)(SuccessPopup);
