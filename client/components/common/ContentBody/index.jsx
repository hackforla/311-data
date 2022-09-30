import PropTypes from 'prop-types';
import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import sharedLayout from '@theme/layout';

const ContentBody = ({ children, maxWidth }) => {
  const classes = sharedLayout();

  return (
    <Grid container className={classes.topMargin5} alignItems="center" justify="center" direction="column">
      <Grid item>
        <Container component="main" maxWidth={maxWidth}>
          {children}
        </Container>
      </Grid>
    </Grid>
  );
};

ContentBody.defaultProps = {
  maxWidth: 'md',
};

ContentBody.propTypes = {
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.string,
};

export default ContentBody;
