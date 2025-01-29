
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

function RequestDetailLoader({
  classes,
  requestId,
  pinsInfo,
  requestTypes,
  agencies,
  // dispatchGetPinInfoRequest,
  dispatchUpdatePinInfo,
  startDate,
  endDate,
  loadingCallback
}) {
  const { conn } = useContext(DbContext);
  const getPinInfo = useCallback(async () => {
    if (!requestId) return;

    try {
      const startYear = moment(startDate).year();
      const endYear = moment(endDate).year();

      let getPinsInfoSQL = '';

      if (startYear === endYear) {
        // If search date range is within the same year
        const tableName = `requests_${startYear}`;
        getPinsInfoSQL = `SELECT * FROM ${tableName} WHERE TRIM(SRNumber) = '${requestId}'`;
      } else {
        // If search date range is across two different years
        const tableNameStartYear = `requests_${startYear}`;
        const tableNameEndYear = `requests_${endYear}`;

        getPinsInfoSQL = `
          (SELECT * FROM ${tableNameStartYear} WHERE TRIM(SRNumber) = '${requestId}')
          UNION ALL
          (SELECT * FROM ${tableNameEndYear} WHERE TRIM(SRNumber) = '${requestId}')
        `;
      }

      const pinsInfoAsArrowTable = await conn.query(getPinsInfoSQL);
      const newPinsInfo = ddbh.getTableData(pinsInfoAsArrowTable);

      if (
        !!newPinsInfo === true
        && Array.isArray(newPinsInfo)
        && newPinsInfo.length > 0
      ) {
        dispatchUpdatePinInfo(newPinsInfo[0]); // Assumes first entry is correct, adjust as needed
      }
    } catch (e) {
      console.error('RequestDetail: Error occurred: ', e);
    }
  }, [requestId, conn, dispatchUpdatePinInfo, startDate, endDate]);

  useEffect(() => {
    async function fetchPins() {
      if (requestId) {
        await getPinInfo(requestId);
        loadingCallback();
      }
    }

    fetchPins();
  }, [requestId, getPinInfo]);

  const renderDaysOpen = days => {
    switch (days) {
      case 0:
        return 'today';
      case 1:
        return `${days} day`;
      default:
        return `${days} days`;
    }
  };

  return (
    <div className={classes.popupContent}>
      <CircularProgress
        className={classes.loader}
        size={30}
        color="inherit"
      />
      <div className={classes.loaderText}>loading...</div>
    </div>
  );
}

RequestDetailLoader.propTypes = {
  requestId: PropTypes.string,
  pinsInfo: PropTypes.shape({}),
  requestTypes: PropTypes.arrayOf(PropTypes.shape({})),
  agencies: PropTypes.arrayOf(PropTypes.shape({})),
  dispatchUpdatePinInfo: PropTypes.func.isRequired,
};

RequestDetailLoader.defaultProps = {
  requestId: null,
  pinsInfo: {},
  agencies: null,
  requestTypes: null,
};

const mapStateToProps = state => ({
  pinsInfo: state.data.pinsInfo,
  requestTypes: state.metadata.requestTypes,
  agencies: state.metadata.agencies,
  startDate: state.filters.startDate,
  endDate: state.filters.endDate,
});

const mapDispatchToProps = dispatch => ({
  dispatchUpdatePinInfo: pinInfo => dispatch(updatePinInfo(pinInfo)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(RequestDetailLoader));