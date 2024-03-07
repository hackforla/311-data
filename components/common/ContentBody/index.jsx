import PropTypes from 'prop-types';
import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import sharedLayout from '@theme/layout';
import clsx from 'clsx';

// ContentBody keeps the body of all content pages centered
// with a customizable maxWidth container that defaults to 'md'.

const ContentBody = ({ children, maxWidth, hasTopMargin }) => {
  const classes = sharedLayout();

  return (
    <Grid container className={clsx(hasTopMargin && classes.marginTopLarge)} alignItems="center" justify="center" direction="column">
      <Grid item>
        <Container component="main" maxWidth={maxWidth}>
          <div>
            {children}
          </div>
        </Container>
      </Grid>
    </Grid>
  );
};

ContentBody.defaultProps = {
  children: {},
  maxWidth: 'md',
  hasTopMargin: true,
};

ContentBody.propTypes = {
  children: PropTypes.node,
  maxWidth: PropTypes.string,
  hasTopMargin: PropTypes.bool,
};

export default ContentBody;
