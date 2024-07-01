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
        src="https://docs.google.com/forms/d/e/1FAIpQLScrhJY9ezqlKcpYermIImgGKYZ4bP2k1BRAOpuEay-tVXfvdQ/viewform?embedded=true"
        className={classes.iframe}
        title="Contact Form"
      >
        Loading…
      </iframe>
    </div>
  );
}

export default ContactForm;
