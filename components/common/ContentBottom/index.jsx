import React from 'react';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  bottomSpacing: {
    height: theme.footer.height,
  },
}));

// ContentBottom is used to provide the necessary amount of bottom margin on
// all content pages to prevent the fixed footer from covering the
// bottom of the content pages. This component is utilized at the bottom of the
// component page <Switch> of Routes.jsx

function ContentBottom() {
  const classes = useStyles();
  return (
    <Grid container className={classes.bottomSpacing}>
      {/*  an empty grid container with footer height to prevent
        *  fixed positioned footer from obscuring submit button */}
    </Grid>
  );
}

export default ContentBottom;
