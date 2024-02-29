import React from 'react';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import sharedLayout from '@theme/layout';
import { Box } from '@mui/material';
import typography from '@theme/typography';

const useStyles = makeStyles(theme => ({
  contentTitle: {
    fontSize: typography.h6.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    paddingTop: theme.spacing(10)
  },
  contentSentence: {
    paddingBottom: theme.spacing(10),
    textAlign: "center"
  }
}));

function ContactIntro() {
  const classes = { ...useStyles(), ...sharedLayout() };

  return (
    <Grid container alignItems="center" justifyContent="center" direction="column">
      <Grid item>
        <Box align="center">
          <Typography className={classes.contentTitle}>
            {'Don\'t See What You Need?'}
          </Typography>
        </Box>
        <div className={classes.marginTopSmall}>
          <Typography variant="body1" className={classes.contentSentence}>
            We are open to suggestions and feedback and would love the opportunity to get connected.
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
}

export default ContactIntro;
