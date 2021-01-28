import React, { useState } from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { toggleLegend } from '@reducers/ui';

const Legend = () => {
  return (
    <div>
      <h1>Legend</h1>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  toggleLegend: () => dispatch(toggleLegend()),
});

export default connect(null, mapDispatchToProps)(Legend);

Legend.propTypes = {
  toggleLegend: PropTypes.func.isRequired,
};