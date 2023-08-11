import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';

const QuadLayout = ({
  quadrant1, quadrant2, quadrant3, quadrant4,
}) => (
  <Grid container spacing={3}>
    <Grid item xs={12} sm={6} md={3}>
      {quadrant1}
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      {quadrant2}
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      {quadrant3}
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      {quadrant4}
    </Grid>
  </Grid>
);

QuadLayout.propTypes = {
  quadrant1: PropTypes.element.isRequired,
  quadrant2: PropTypes.element.isRequired,
  quadrant3: PropTypes.element.isRequired,
  quadrant4: PropTypes.element.isRequired,
};

export default QuadLayout;
