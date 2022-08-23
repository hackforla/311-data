import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { sendGitRequest } from '@reducers/data';
import clx from 'classnames';

// makeStyles from v1
// import {
//   makeStyles,
// } from '@material-ui/core';
//
// const useStyles = makeStyles({
//   root: {
//     color: 'black',
//     backgroundColor: 'white',
//     minHeight: '40em',
//     padding: '2em',
//     '& h1': {
//       fontSize: '2.5em',
//     },
//     '& img': {
//       maxWidth: '100%',
//       height: 'auto',
//       display: 'block',
//       marginLeft: 'auto',
//       marginRight: 'auto',
//     },
//     '& label': {
//       marginTop: '1em',
//       fontWeight: 500,
//       display: 'block',
//       width: '20em',
//     },
//     '& input': {
//       width: '40em',
//       padding: '0.5em',
//     },
//     '& textarea': {
//       width: '40em',
//       padding: '0.5em',
//     },
//   },
// });

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

const ContactForm = () => {
  /* Note: the `useState` declaration below uses destructuring syntax to initialize individual
   * state variables. each variable (e.g. - firstName, missingFirstName, etc) will contain initial
   * values as per each key:value defined in the contactInitialState` object above. each value will
   * become globally accessible variable within the ContactForm component
  */
  const [{
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
  },
  setState] = useState(contactInitialState);

  function clearFields() {
    setState({ ...contactInitialState });
  }

  useEffect(() => {
    clearFields();
  }, []);

  function validateEmail(emailAddress) {
    // eslint-disable-next-line
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress)) {
      return true;
    }
    return false;
  }

  function validateForm() {
    const noFirstName = firstName.trim().length === 0;
    const noLastName = lastName.trim().length === 0;
    const noEmail = email.trim().length === 0;
    const noMessage = message.trim().length === 0;
    const incompleteEmail = (!noEmail && !validateEmail(email));
    if (!noFirstName && !noLastName && !noEmail && !noMessage && !incompleteEmail) {
      return true;
    }

    setState(prevState => ({
      ...prevState,
      ...{
        errors: {
          missingFirstName: noFirstName,
          missingLastName: noLastName,
          missingEmail: noEmail,
          invalidEmail: incompleteEmail,
          missingMessage: noMessage,
        },
      },
    }));
    return false;
  }

  function onInputChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    setState(prevState => ({ ...prevState, [name]: value }));
  }

  // define a method, `callSendGitRequest`, to dispatch an action to redux using `useDipatch()` hook
  // (notice there is no need to use `connect` or `mapStateToProps` anymore)
  const dispatch = useDispatch();
  const callSendGitRequest = useCallback(obj => dispatch(sendGitRequest(obj)), [dispatch]);

  function handleSubmit(event) {
    event.preventDefault();

    if (validateForm()) {
      const body = [
        `First name: ${firstName}`,
        `Last name: ${lastName}`,
        `Email: ${email}`,
        `Association: ${association || 'Not provided'}`,
        `Message: ${message}`,
      ].join('\n');

      callSendGitRequest({ title: email, body }); // dispatch action to redux with payload

      setState(prevState => ({ ...prevState, ...{ loading: true } }));
    }
  }

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
                  onChange={onInputChange}
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
                  onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
              />
            </div>
          </label>
          { missingMessage && <p className="help is-danger has-text-left">Please provide a message.</p> }
        </div>
        <button
          id="contact-submit"
          className={clx('contact-button', { 'is-loading': loading })}
          type="submit"
          label="Submit"
          onClick={handleSubmit}
        />
      </form>
      {/* TODO: Add <Loader /> */}
      {/* TODO: Add Error/Success Modal */}
    </div>
  );
};

export default ContactForm;
