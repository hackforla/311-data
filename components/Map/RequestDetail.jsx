/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import withStyles from '@mui/styles/withStyles';
import moment from 'moment';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CircularProgress from '@mui/material/CircularProgress';
import DbContext from '@db/DbContext';
import toTitleCase from '@utils/toTitleCase';
import { updatePinInfo } from '@reducers/data';
import ddbh from '@utils/duckDbHelpers.js';
import { isEmpty } from '@utils';

// Your styles here
const styles = theme => ({
  loader: {
    margin: 10,
  },
  loaderText: {
    textAlign: 'center',
    marginTop: -10,
  },
  popupContent: {
    backgroundColor: theme.palette.primary.main,
    padding: '0 8',
    width: '100%',

  },
  requestType: {
    ...theme.typography.h5,
    marginRight: 5,
  },
  icon: {
    display: 'block',
  },
  divider: {
    marginTop: 6,
    marginBottom: 8,
  },
  info1: {
    ...theme.typography.body1,
    marginTop: 0,
    marginBottom: 0,
  },
  councilName: {
    color: '#A8A8A8',
    marginTop: 5,
  },
  info2: {
    marginTop: 14,
  },
});

function RequestDetail({
  classes,
}) {

  return (
    <div className={classes.popupContent}>
      <p>AAAAAAAAAAAAAAAAAAAAAAA</p>
      <p>BBBBBBBBB</p>
      <p>CCCCCCCCCCCCCCCCC</p>
      <p>DDDDDDDDDDD</p>
      <p>EEE</p>
      <p>FFFFFFFFFFFFFFFFFFFFFFF</p>
    </div>
  );
}

RequestDetail.propTypes = {
};

RequestDetail.defaultProps = {
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(RequestDetail));
