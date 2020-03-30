import React, { Component } from 'react';

class ContactForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      association: '',
      message: '',
      errorMessage: '',
    };
  }

  onInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    const {
      firstName,
      lastName,
      email,
      message,
    } = this.state;

    event.preventDefault();

    if (firstName === '' || lastName === '' || email === '' || message === '') {
      this.setState({ errorMessage: 'Please fill out all required fields marked with an asterisk' });
    } else {
      this.setState({ errorMessage: '' });
    }
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      association,
      message,
      errorMessage,
    } = this.state;

    return (
      <div className="form-container">
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
                onChange={this.onInputChange.bind(this)}
              />
            </label>
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
                rows="6"
                value={message}
                onChange={this.onInputChange.bind(this)}
              />
            </label>
          </div>

          <p className="error-msg">{errorMessage}</p>

          <div className="btn-container">
            <button type="submit" className="contact-btn" onClick={event => this.handleSubmit(event)}>
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default ContactForm;
