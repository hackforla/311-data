import React from 'react';
import { useForm } from '@formspree/react';
import {
  makeStyles,
  Container,
  Grid,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    color: 'black',
    backgroundColor: 'white',
    minHeight: '40em',
    padding: '2em',
    '& h1': {
      fontSize: '2.5em',
    },
    '& img': {
      maxWidth: '100%',
      height: 'auto',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    '& label': {
      marginTop: '1em',
      fontWeight: 500,
      display: 'block',
      width: '20em',
    },
    '& input': {
      width: '40em',
      padding: '0.5em',
    },
    '& textarea': {
      width: '40em',
      padding: '0.5em',
    },
  },
});

const FORMSPREE_FORM_ID = 'xknkwwez';

const ContactForm = () => {
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID);
  const classes = useStyles();

  React.useEffect(() => {
    console.log(state);
  });

  return (
    <Container className={classes.root} maxWidth="md">
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <h1>Contact Us</h1>
          { state.succeeded
              && (
                <div>
                  Thanks for contacting us! We will get back to you in 2-3 business days.
                </div>
              )}
          { !state.succeeded
              && (
                <>
                  <div>
                    Don&apos;t See What You Need?
                    We want to build a tool that works for you.
                    We are open to suggestions and feedback and would love the opportunity
                    to get connected.
                    Feel free to input your information in the contact form below
                    and we will be sure to get back to you within 2-3 business days.
                  </div>
                  <form id="fs-frm" onSubmit={handleSubmit} name="simple-contact-form">
                    <div>
                      <label htmlFor="full-name">Full Name</label>
                      <input type="text" name="name" id="full-name" placeholder="First and Last" />
                    </div>
                    <div>
                      <label htmlFor="email-address">Email Address</label>
                      <input type="email" name="_replyto" id="email-address" placeholder="email@domain.com" required="" />
                    </div>
                    <div>
                      <label htmlFor="message">Message</label>
                      <textarea rows="5" name="message" id="message" placeholder="Your message here" required="" />
                    </div>
                    <input type="hidden" name="_subject" id="email-subject" value="Contact Form Submission" />
                    <Button variant="contained" color="primary" type="submit" disabled={state.submitting}>Send Message</Button>
                  </form>
                </>
              )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactForm;
