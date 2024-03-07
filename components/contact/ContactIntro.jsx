import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import sharedLayout from '@theme/layout';

const useStyles = makeStyles(theme => ({
  contentTitle: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const ContactIntro = () => {
  const classes = { ...useStyles(), ...sharedLayout() };

  return (
    <Grid container alignItems="center" justify="center" direction="column">
      <Grid item>
        <div align="center">
          <Typography variant="h6" className={classes.contentTitle}>
            {'Don\'t See What You Need?'}
          </Typography>
        </div>
        <div className={classes.marginTopSmall}>
          <Typography variant="body1">
            We want to build a tool that works for you. We are open to suggestions and
            feedback and would love the opportunity to get connected. Feel free to input
            your information in the contact form below and we will be sure to get back to
            you within 2-3 business days. Thank you!
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
};

export default ContactIntro;
