import React from 'react';
import {
  Grid,
} from '@material-ui/core';

const ContactIntro = () => (
  <Grid container alignItems="center" justify="center" direction="column">
    <Grid item style={{ width: '45%' }}>
      <h1 style={{ textAlign: 'center' }}>
        {'Don\'t See What You Need?'}
      </h1>
      <p>
        We want to build a tool that works for you. We are open to suggestions and
        feedback and would love the opportunity to get connected. Feel free to input
        your information in the contact form below and we will be sure to get back to
        you within 2-3 business days. Thank you!
      </p>
    </Grid>
  </Grid>
);

export default ContactIntro;
