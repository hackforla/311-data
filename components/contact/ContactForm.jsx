import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(({
  formContainer: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iframe: {
    border: 'none',
    width: '100%',
    height: '1200px',
    minHeight: '856px',
  },
}));

function ContactForm() {
  const classes = useStyles();

  return (
    <div className={classes.formContainer}>
      {/* Embed the Google Form */}
      <iframe
        src={import.meta.env.MODE === 'development'
          ? import.meta.env.VITE_CONTACT_FORM_DEV
          : import.meta.env.VITE_CONTACT_FORM_PROD
        }
        className={classes.iframe}
        title="Contact Form"
      >
        Loading…
      </iframe>
    </div>
  );
}

export default ContactForm;
