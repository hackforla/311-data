import PropTypes from 'prop-types';
import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import clsx from 'clsx';
import sharedLayout from '@theme/layout';

// ContentBody keeps the body of all content pages centered
// with a customizable maxWidth container that defaults to 'md'.

function ContentBody({ children, maxWidth, hasTopMargin }) {
  const classes = sharedLayout();

  return (
    <Grid container className={clsx(hasTopMargin && classes.marginTopLarge)} alignItems="center" justifyContent="center" direction="column">
      <Grid item>
        <Container component="main" maxWidth={maxWidth}>
          <div>
            {children}
          </div>
        </Container>
      </Grid>
    </Grid>
  );
}

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
