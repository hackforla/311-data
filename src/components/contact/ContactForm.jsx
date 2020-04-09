import React, { Component } from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { sendGitRequest } from '@reducers/data';
import { showFeedbackSuccess } from '@reducers/ui';

import Loader from '@components/common/Loader';
import Modal from '@components/common/Modal';
import DataRequestError from '@components/main/body/DataRequestError';

const contactInitialState = {
  firstName: '',
  lastName: '',
  email: '',
  association: '',
  message: '',
  disableButton: true,
  invalidEmail: false,
};

class ContactForm extends Component {
  constructor(props) {
    super(props);
    this.state = contactInitialState;
    this.timer = null;
  }

  componentDidUpdate() {
    const { displayFeedbackSuccess } = this.props;
    // Hide success message and clear form fields after 5 seconds
    if (displayFeedbackSuccess) {
      this.timer = setTimeout(() => this.clearFeedback(), 5000);
    }
  }

  componentWillUnmount() {
    const { displayFeedbackSuccess } = this.props;
    if (displayFeedbackSuccess) {
      this.clearFeedback();
    }
    // Clear timeout to prevent memory leak if user navigates to another page before timer fires
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  clearFeedback = () => {
    // Dispatches UI action to hide feedback success message and clears form fields
    const { showSuccessMessage } = this.props;
    showSuccessMessage(false);
    this.setState(contactInitialState);
  };

  validateEmail = email => {
    // eslint-disable-next-line
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return true;
    }
    return false;
  }

  onInputChange = event => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value },
      () => {
        const {
          firstName,
          lastName,
          email,
          message,
        } = this.state;

        if (firstName !== '' && lastName !== '' && email !== '' && message !== '') {
          this.setState({
            disableButton: false,
          });
        } else {
          this.setState({
            disableButton: true,
            invalidEmail: false,
          });
        }
      });
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

    if (this.validateEmail(email)) {
      const { submitFeedback } = this.props;
      this.setState({
        disableButton: true,
        invalidEmail: false,
      });

      const body = [
        `First name: ${firstName}`,
        `Last name: ${lastName}`,
        `Email: ${email}`,
        `Association: ${association || 'Not provided'}`,
        `Message: ${message}`,
      ].join('\n');

      submitFeedback({ title: email, body });
    } else {
      this.setState({
        invalidEmail: true,
      });
    }
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      association,
      message,
      disableButton,
      invalidEmail,
    } = this.state;

    const {
      openErrorModal,
      displayFeedbackSuccess,
    } = this.props;

    return (
      <div className="feedback-form form-container">
        <form id="contact-form">
          <div className="form-group" id="fname-form">
            <label htmlFor="firstName">
              First Name
              <span className="asterisk">*</span>
              <input
                name="firstName"
                type="text"
                className="form-control"
                value={firstName}
                onChange={this.onInputChange.bind(this)}
                required
              />
            </label>
          </div>

          <div className="form-group" id="lname-form">
            <label htmlFor="lastName">
              Last Name
              <span className="asterisk">*</span>
              <input
                name="lastName"
                type="text"
                className="form-control"
                value={lastName}
                onChange={this.onInputChange.bind(this)}
                required
              />
            </label>
          </div>

          <div className="form-group" id="email-form">
            <label htmlFor="email">
              Email
              <span className="asterisk">*</span>
              <input
                name="email"
                type="email"
                className="form-control"
                value={email}
                required
                onChange={this.onInputChange.bind(this)}
              />
            </label>
            { invalidEmail && (
              <p className="invalid-email-message">Please provide a valid email address.</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="association">
              Association
              <input
                name="association"
                type="text"
                className="form-control"
                value={association}
                onChange={this.onInputChange.bind(this)}
              />
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="message">
              Message
              <span className="asterisk">*</span>
              <textarea
                name="message"
                className="form-control"
                rows="7"
                value={message}
                onChange={this.onInputChange.bind(this)}
                required
              />
            </label>
          </div>

          <div className="btn-container">
            { displayFeedbackSuccess && (
              <p className="has-text-centered feedback-success">Thanks for your feedback!</p>
            )}
            <button type="submit" className="contact-btn" onClick={event => this.handleSubmit(event)} disabled={disableButton}>
              Submit
            </button>
          </div>
        </form>
        <Loader />
        <Modal
          open={openErrorModal}
          content={<DataRequestError />}
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
});

ContactForm.propTypes = {
  submitFeedback: PropTypes.func.isRequired,
  openErrorModal: PropTypes.bool.isRequired,
  showSuccessMessage: PropTypes.func.isRequired,
  displayFeedbackSuccess: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ContactForm);
