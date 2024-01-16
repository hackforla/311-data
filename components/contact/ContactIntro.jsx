import React from 'react';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import sharedLayout from '@theme/layout';
import { Box } from '@mui/material';

const useStyles = makeStyles(theme => ({
  contentTitle: {
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

function ContactIntro() {
  const classes = { ...useStyles(), ...sharedLayout() };

  return (
    <Grid container alignItems="center" justifyContent="center" direction="column">
      <Grid item>
        <Box align="center">
          <Typography variant="h6" className={classes.contentTitle}>
            {'Don\'t See What You Need?'}
          </Typography>
        </Box>
        <div className={classes.marginTopSmall}>
          <Typography variant="body1">
            We are open to suggestions and feedback and would love the opportunity to get connected.
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
}

export default ContactIntro;
