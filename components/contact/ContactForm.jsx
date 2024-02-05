import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import { showFeedbackSuccess, setErrorModal } from '@reducers/ui';
import { sendGitRequest } from '@reducers/data';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles(theme => ({
  formLabel: {
    fontSize: '18px',
    color: '#29404F',
    fontWeight: 500,
  },
  // form: {
  //   width: '100%',
  // },
  // container: {
  //   width: '684px',
  //   margin: '0 auto',
  // },
}));

const initialFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  association: '',
  message: '',
  errors: {
    missingFirstName: false,
    invalidFirstName: false,
    missingLastName: false,
    invalidLastName: false,
    missingEmail: false,
    invalidEmail: false,
    missingMessage: false,
    invalidMessage: false,
  },
  loading: false,
};

const toastEmitterSettings = {
  position: 'bottom-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

function ContactForm() {
  const dispatch = useDispatch();
  const classes = useStyles()
  // mapStateToProps equivalent.
  const displayFeedbackSuccess = useSelector(state => state.ui.displayFeedbackSuccess);
  const openErrorModal = useSelector(state => state.ui.error.isOpen);

  const [formValues, setFormValues] = useState(initialFormValues);

  function clearFields() {
    setFormValues({
      ...initialFormValues,
    });
  }

  function setLoading(isLoading) {
    setFormValues(prevState => ({
      ...prevState,
      ...{
        loading: isLoading,
      },
    }));
  }

  // Initialize component.
  useEffect(() => {
    // componentDidMount code goes here...
    if (displayFeedbackSuccess) {
      toast.success('We received your message. Our team will contact you at the email address provided.', toastEmitterSettings);
      clearFields();
    }

    if (openErrorModal) {
      toast.error('We failed to process your message. Please try again later.', toastEmitterSettings);
      setLoading(false);
    }

    return () => {
      // componentWillUnmount code goes here...
      dispatch(showFeedbackSuccess(false));
      dispatch(setErrorModal(false));
    };
  }, [dispatch, displayFeedbackSuccess, openErrorModal]);

  // Helper methods.
  function validateEmail(emailAddress) {
    // A regular expression checking for a valid email format.
    const VALID_EMAIL_FORMAT_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return VALID_EMAIL_FORMAT_REGEX.test(emailAddress);
  }

  function validateName(name) {
    // A regular expression checking for valid names (first and last).
    const NAME_REGEX = /^[a-zA-Z]+$/;
    return NAME_REGEX.test(name);
  }

  const clearErrors = useCallback(() => {
    setFormValues(prevState => ({
      ...prevState,
      ...{
        errors: {
          missingFirstName: false,
          invalidFirstName: false,
          missingLastName: false,
          invalidLastName: false,
          missingEmail: false,
          invalidEmail: false,
          missingMessage: false,
          invalidMessage: false,
        },
      },
    }));
  }, []);

  const validateForm = useCallback(() => {
    const noFirstName = formValues.firstName.trim().length === 0;
    const notValidFirstName = !validateName(formValues.firstName.trim());
    const noLastName = formValues.lastName.trim().length === 0;
    const notValidLastName = !validateName(formValues.lastName.trim());
    const noEmail = formValues.email.trim().length === 0;
    const noMessage = formValues.message.trim().length === 0;
    const incompleteEmail = (!noEmail && !validateEmail(formValues.email));
    const invalidMessageLength = formValues.message.trim().length < 6
      || formValues.message.trim().length > 1000;
    if (!noFirstName && !noLastName && !notValidFirstName && !notValidLastName
      && !noEmail && !incompleteEmail
      && !noMessage && !invalidMessageLength) {
      return true;
    }

    setFormValues(prevState => ({
      ...prevState,
      ...{
        errors: {
          missingFirstName: noFirstName,
          invalidFirstName: notValidFirstName,
          missingLastName: noLastName,
          invalidLastName: notValidLastName,
          missingEmail: noEmail,
          invalidEmail: incompleteEmail,
          missingMessage: noMessage,
          invalidMessage: invalidMessageLength,
        },
      },
    }));
    return false;
  }, [formValues]);

  // Event handlers.
  const onInputChange = useCallback(event => {
    const { name, value } = event.target;
    setFormValues(prevState => ({ ...prevState, [name]: value }));
  }, []);

  const handleSubmit = useCallback(event => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const body = [
      `First name: ${formValues.firstName.trim()}`,
      `Last name: ${formValues.lastName.trim()}`,
      `Email: ${formValues.email.trim()}`,
      `Association: ${formValues.association.trim() || 'Not provided'}`,
      `Message: ${formValues.message.trim()}`,
    ].join('\n');

    setLoading(true);

    // Dispatch action to redux with payload.
    dispatch(sendGitRequest({ title: formValues.email, body }));
  }, [dispatch,
    formValues.association,
    formValues.email,
    formValues.firstName,
    formValues.lastName,
    formValues.message,
    validateForm]);

  return (
    <form id="contact-form" onSubmit={handleSubmit}>
      <Grid container alignItems="center" justifyContent="center" direction="column">
        <Grid container alignItems="center" justifyContent="center" direction="row" spacing={2}>
          <Grid item xs={6}>
            <InputLabel htmlFor='contact-firstname' className={classes.formLabel}>First Name*</InputLabel>
            <TextField
              id="contact-firstname"
              name="firstName"
              type="text"
              autoComplete="off"
              value={formValues.firstName}
              onChange={onInputChange}
              onFocus={clearErrors}
              error={formValues.errors.missingFirstName || formValues.errors.invalidFirstName}
              helperText={formValues.errors.missingFirstName || formValues.errors.invalidFirstName ? 'Please provide a first name.' : ''}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <InputLabel htmlFor='contact-lastname' className={classes.formLabel}>Last Name*</InputLabel>
            <TextField
              id="contact-lastname"
              name="lastName"
              type="text"
              autoComplete="off"
              value={formValues.lastName}
              onChange={onInputChange}
              onFocus={clearErrors}
              error={formValues.errors.missingLastName || formValues.errors.invalidLastName}
              helperText={formValues.errors.missingLastName || formValues.errors.invalidLastName ? 'Please provide a valid last name.' : ''}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container alignItems="center" justifyContent="center" direction="row">
          <Grid item xs={12}>
            <InputLabel htmlFor='contact-email' className={classes.formLabel}>Email*</InputLabel>
            <TextField
              id="contact-email"
              name="email"
              type="text"
              autoComplete="off"
              value={formValues.email}
              onChange={onInputChange}
              onFocus={clearErrors}
              error={formValues.errors.missingEmail || formValues.errors.invalidEmail}
              helperText={formValues.errors.missingEmail || formValues.errors.invalidEmail ? 'Please provide a valid email address.' : ''}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel htmlFor='contact-association' className={classes.formLabel}>Association</InputLabel>
            <TextField
              id="contact-association"
              name="association"
              type="text"
              autoComplete="off"
              value={formValues.association}
              onChange={onInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} style={{ paddingTop: '12px' }}>
            <InputLabel htmlFor='contact-association' className={classes.formLabel}>Message*</InputLabel>
            <TextField
              id="contact-message"
              name="message"
              type="text"
              variant="outlined"
              rows={8}
              autoComplete="off"
              value={formValues.message}
              onChange={onInputChange}
              onFocus={clearErrors}
              error={formValues.errors.missingMessage || formValues.errors.invalidMessage}
              helperText={formValues.errors.missingMessage || formValues.errors.invalidMessage ? 'Please provide a message (6-1000 characters).' : ''}
              fullWidth
              multiline
            />
          </Grid>
        </Grid>
        <Grid container direction="column" alignItems="center" justifyContent="center" style={{ paddingTop: '20px' }}>
          <CircularProgress style={{ display: formValues.loading ? 'block' : 'none' }} />
          <Button variant="contained" color="secondary" type="submit" style={{ display: formValues.loading ? 'none' : 'block' }}>
            Submit
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default ContactForm;
