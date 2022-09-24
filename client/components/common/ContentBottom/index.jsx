import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  bottomSpacing: {
    height: theme.footer.height,
  },
}));

const ContentBottom = () => {
  const classes = useStyles();
  return (
    <Grid container className={classes.bottomSpacing}>
      {/*  an empty grid container with footer height to prevent
        *  fixed positioned footer from obscuring submit button */}
    </Grid>
  );
};

export default ContentBottom;
