import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import layout from '@theme/layout';

const useStyles = makeStyles(() => ({
  contactIntroHeading: layout.contentMarginTop,
  contactIntroBody: {
    margin: '1em 0',
  },
}));

const ContactIntro = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="sm">
      <Grid container alignItems="center" justify="center" direction="column">
        <Grid item>
          <div className={classes.contactIntroHeading}>
            <Typography variant="subtitle1" align="left">
              {'Don\'t See What You Need?'}
            </Typography>
          </div>
          <div className={classes.contactIntroBody}>
            <Typography variant="body1">
              We want to build a tool that works for you. We are open to suggestions and
              feedback and would love the opportunity to get connected. Feel free to input
              your information in the contact form below and we will be sure to get back to
              you within 2-3 business days. Thank you!
            </Typography>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactIntro;
