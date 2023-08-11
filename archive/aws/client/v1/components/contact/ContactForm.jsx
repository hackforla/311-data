import React, { Component } from 'react';
import PropTypes from 'proptypes';
import clx from 'classnames';
import { connect } from 'react-redux';
import { sendGitRequest } from '@reducers/data';
import { showFeedbackSuccess, setErrorModal } from '@reducers/ui';

import Loader from '@components/common/Loader';
import Modal from '@components/common/Modal';
import Button from '@components/common/Button';
import DataRequestError from '@components/main/body/DataRequestError';
import SuccessPopup from './SuccessPopup';

const contactInitialState = {
  firstName: '',
  lastName: '',
  email: '',
  association: '',
  message: '',
  errors: {
    missingFirstName: false,
    missingLastName: false,
    missingEmail: false,
    invalidEmail: false,
    missingMessage: false,
  },
  loading: false,
};

class ContactForm extends Component {
  constructor(props) {
    super(props);
    this.state = contactInitialState;
  }

  static getDerivedStateFromProps = nextProps => {
    const { displayFeedbackSuccess, openErrorModal } = nextProps;
    if (displayFeedbackSuccess || openErrorModal) {
      return { loading: false };
    }
    return null;
  }

  componentWillUnmount() {
    const { showSuccessMessage, showErrorModal } = this.props;
    showSuccessMessage(false);
    showErrorModal(false);
    this.clearFields();
  }

  clearFields = () => {
    this.setState(contactInitialState);
  };

  validateEmail = email => {
    // eslint-disable-next-line
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    return false;
  }

  validateForm = () => {
    const {
      firstName,
      lastName,
      email,
      message,
    } = this.state;

    const noFirstName = firstName.trim().length === 0;
    const noLastName = lastName.trim().length === 0;
    const noEmail = email.trim().length === 0;
    const noMessage = message.trim().length === 0;
    const incompleteEmail = (!noEmail && !this.validateEmail(email));
    if (!noFirstName && !noLastName && !noEmail && !noMessage && !incompleteEmail) {
      return true;
    }
    this.setState({
      errors: {
        missingFirstName: noFirstName,
        missingLastName: noLastName,
        missingEmail: noEmail,
        invalidEmail: incompleteEmail,
        missingMessage: noMessage,
      },
    });
    return false;
  };

  onInputChange = event => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();
    const {
      firstName,
      lastName,
      email,
      association,
      message,
    } = this.state;

    if (this.validateForm()) {
      const { submitFeedback } = this.props;
      const body = [
        `First name: ${firstName}`,
        `Last name: ${lastName}`,
        `Email: ${email}`,
        `Association: ${association || 'Not provided'}`,
        `Message: ${message}`,
      ].join('\n');

      submitFeedback({ title: email, body });
      this.setState({ loading: true });
    }
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      association,
      message,
      errors: {
        missingFirstName,
        missingLastName,
        missingEmail,
        invalidEmail,
        missingMessage,
      },
      loading,
    } = this.state;

    const {
      openErrorModal,
      displayFeedbackSuccess,
    } = this.props;

    return (
      <div className="feedback-form form-container">
        <form id="contact-form">

          <div className="field columns">
            <div className="column">
              <label className="label" htmlFor="contact-firstname">
                First Name
                <span className="asterisk has-text-danger">*</span>
                <div className="control">
                  <input
                    id="contact-firstname"
                    className={clx('input', { 'is-danger': missingFirstName })}
                    name="firstName"
                    type="text"
                    value={firstName}
                    onChange={this.onInputChange}
                    required
                  />
                </div>
              </label>
              { missingFirstName && <p className="help is-danger has-text-left">Please provide a first name.</p> }
            </div>

            <div className="column">
              <label className="label" htmlFor="contact-lastname">
                Last Name
                <span className="asterisk has-text-danger">*</span>
                <div className="control">
                  <input
                    id="contact-lastname"
                    className={clx('input', { 'is-danger': missingLastName })}
                    name="lastName"
                    type="text"
                    value={lastName}
                    onChange={this.onInputChange}
                    required
                  />
                </div>
              </label>
              { missingLastName && <p className="help is-danger has-text-left">Please provide a last name.</p> }
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="contact-email">
              Email
              <span className="asterisk has-text-danger">*</span>
              <div className="control">
                <input
                  id="contact-email"
                  className={clx('input', { 'is-danger': missingEmail || invalidEmail })}
                  name="email"
                  type="email"
                  value={email}
                  required
                  onChange={this.onInputChange}
                />
              </div>
            </label>
            { missingEmail && <p className="help is-danger has-text-left">Please provide an email address.</p> }
            { invalidEmail && <p className="help is-danger has-text-left">Please provide a valid email address.</p> }
          </div>

          <div className="field">
            <label className="label" htmlFor="contact-association">
              Association
              <div className="control">
                <input
                  id="contact-association"
                  className="input"
                  name="association"
                  type="text"
                  value={association}
                  onChange={this.onInputChange}
                />
              </div>
            </label>
          </div>

          <div className="field">
            <label className="label" htmlFor="contact-message">
              Message
              <span className="asterisk has-text-danger">*</span>
              <div className="control">
                <textarea
                  id="contact-message"
                  name="message"
                  className={clx('textarea', { 'is-danger': missingMessage })}
                  rows="6"
                  value={message}
                  required
                  onChange={this.onInputChange}
                />
              </div>
            </label>
            { missingMessage && <p className="help is-danger has-text-left">Please provide a message.</p> }
          </div>
          <Button
            id="contact-submit"
            className={clx('contact-button', { 'is-loading': loading })}
            type="submit"
            label="Submit"
            handleClick={this.handleSubmit}
          />
        </form>
        <Loader />
        <Modal
          open={openErrorModal}
          content={<DataRequestError message="We failed to process your message. Please try again later." />}
        />
        <Modal
          open={displayFeedbackSuccess}
          content={(
            <SuccessPopup
              header="Thanks for your feedback!"
              message="We received your message. Our team will contact you at the email address provided."
              onClick={this.clearFields}
            />
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  openErrorModal: state.ui.error.isOpen,
  displayFeedbackSuccess: state.ui.displayFeedbackSuccess,
});

const mapDispatchToProps = dispatch => ({
  submitFeedback: fields => dispatch(sendGitRequest(fields)),
  showSuccessMessage: bool => dispatch(showFeedbackSuccess(bool)),
  showErrorModal: bool => dispatch(setErrorModal(bool)),
});

ContactForm.propTypes = {
  submitFeedback: PropTypes.func.isRequired,
  showErrorModal: PropTypes.func.isRequired,
  openErrorModal: PropTypes.bool.isRequired,
  showSuccessMessage: PropTypes.func.isRequired,
  displayFeedbackSuccess: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactForm);
