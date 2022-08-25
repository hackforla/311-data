import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { sendGitRequest } from '@reducers/data';
// import clx from 'classnames';

import {
  Container,
  Grid,
  Button,
  TextField,
} from '@material-ui/core';

const initialFormValues = {
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
  const [formValues, setFormValues] = useState(initialFormValues);

  function clearFields() {
    setFormValues({
      ...initialFormValues,
    });
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
    const noFirstName = formValues.firstName.trim().length === 0;
    const noLastName = formValues.lastName.trim().length === 0;
    const noEmail = formValues.email.trim().length === 0;
    const noMessage = formValues.message.trim().length === 0;
    const incompleteEmail = (!noEmail && !validateEmail(formValues.email));
    if (!noFirstName && !noLastName && !noEmail && !noMessage && !incompleteEmail) {
      return true;
    }

    setFormValues(prevState => ({
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
    setFormValues(prevState => ({ ...prevState, [name]: value }));
  }

  function clearErrors() {
    setFormValues(prevState => ({
      ...prevState,
      ...{
        errors: {
          missingFirstName: false,
          missingLastName: false,
          missingEmail: false,
          invalidEmail: false,
          missingMessage: false,
        },
      },
    }));
  }

  // define a method, `callSendGitRequest`, to dispatch an action to redux using
  // `useDipatch()` hook (notice there is no need to use `connect` or
  // `mapStateToProps` anymore)
  const dispatch = useDispatch();
  const callSendGitRequest = useCallback(obj => dispatch(sendGitRequest(obj)), [dispatch]);

  function handleSubmit(event) {
    event.preventDefault();

    if (validateForm()) {
      const body = [
                `First name: ${formValues.firstName}`,
                `Last name: ${formValues.lastName}`,
                `Email: ${formValues.email}`,
                `Association: ${formValues.association || 'Not provided'}`,
                `Message: ${formValues.message}`,
      ].join('\n');

      // dispatch action to redux with payload
      callSendGitRequest({ title: formValues.email, body });

      setFormValues(prevState => ({
        ...prevState,
        ...{
          loading: true,
        },
      }));
    }
  }

  return (
    <Container maxWidth="sm">
      <form id="contact-form" onSubmit={handleSubmit}>
        <Grid container alignItems="center" justify="center" direction="column" style={{ gap: '10px' }}>
          <Grid container alignItems="center" justify="center" direction="row" spacing={2}>
            <Grid item xs={6}>
              <TextField
                id="contact-firstname"
                name="firstName"
                label="First Name *"
                type="text"
                value={formValues.firstName}
                onChange={onInputChange}
                onFocus={clearErrors}
                error={formValues.errors.missingFirstName}
                helperText={formValues.errors.missingFirstName ? 'Please provide a first name.' : ''}
                fullWidth
              />

            </Grid>
            <Grid item xs={6}>
              <TextField
                id="contact-lastname"
                name="lastName"
                label="Last Name *"
                type="text"
                value={formValues.lastName}
                onChange={onInputChange}
                onFocus={clearErrors}
                error={formValues.errors.missingLastName}
                helperText={formValues.errors.missingLastName ? 'Please provide a last name.' : ''}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container alignItems="center" justify="center" direction="row">
            <Grid item xs={12}>
              <TextField
                id="contact-email"
                name="email"
                label="Email *"
                type="text"
                value={formValues.email}
                onChange={onInputChange}
                onFocus={clearErrors}
                error={formValues.errors.missingEmail || formValues.errors.invalidEmail}
                helperText={formValues.errors.missingEmail || formValues.errors.invalidEmail ? 'Please provide a valid email address.' : ''}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="contact-association"
                name="association"
                label="Association"
                type="text"
                value={formValues.association}
                onChange={onInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '8px' }}>
              <TextField
                id="contact-message"
                name="message"
                label="Message *"
                type="text"
                variant="outlined"
                rows={4}
                value={formValues.message}
                onChange={onInputChange}
                onFocus={clearErrors}
                error={formValues.errors.missingMessage}
                helperText={formValues.errors.missingMessage ? 'Please provide a message.' : ''}
                fullWidth
                multiline
              />
            </Grid>
          </Grid>
          <Grid container direction="column" style={{ paddingTop: '8px' }}>
            <Button variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </Grid>

        </Grid>
      </form>
    </Container>

  );
};

export default ContactForm;
