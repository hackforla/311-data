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
import { fontSize, fontWeight } from '@mui/system';

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
    font: 'Roboto',
    fontWeight: 'bold',
    fontSize: '40px',
  },
  sectionHeader: {
    font: 'Roboto',
    fontWeight: 'normal',
    fontSize: '24px',
  },
  detailsStyles: {
    font: 'Roboto',
    fontWeight: 200,
    fontSize: '16px',
    color: '#FFFFFF',
    paddingLeft: '19px',
  },
  icon: {
    display: 'block',
  },
  divider: {
    marginTop: 6,
    marginBottom: 8,
    backgroundColor: '#000000'
  },
  reportedAndClosed: {
     font: 'Roboto',
     fontWeight: 200,
     fontSize: '14px',
     color: '#FFB104'
  },
  sourceAndAgency: {
    font: 'Roboto',
    fontWeight: 200,
    fontSize: '10px',
    color: '#FFFFFF'
  },
  // info1: {
  //   ...theme.typography.body1,
  //   marginTop: 0,
  //   marginBottom: 0,
  // },
  // councilName: {
  //   color: '#A8A8A8',
  //   marginTop: 5,
  // },
  info2: {
    marginTop: 14,
  },
});

function RequestDetail({
  classes,
  requestId,
  pinsInfo,
  requestTypes,
  agencies,
  // dispatchGetPinInfoRequest,
  dispatchUpdatePinInfo,
  startDate,
  endDate,
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

  if (!requestId) return null;
  if (isEmpty(pinsInfo)) {
    return (
      <>
        <CircularProgress
          className={classes.loader}
          size={30}
          color="inherit"
        />
        <div className={classes.loaderText}>loading...</div>
      </>
    );
  }

  const {
    SRNumber: srnumber,
    NCName: councilName,
    RequestType: typeName,
    Owner: agencyName,
    RequestSource: sourceName,
    CreatedDate: createdDate,
    ClosedDate: closedDate,
    Address: address,
  } = pinsInfo;

  // regex fix to replace "/" in typeName
  const formattedTypeName = typeName.split('/').join(' ');

  const { color } = requestTypes.find(({ socrataNames }) => socrataNames
      .map(socrataName => socrataName.toLowerCase().trim())
      .includes(typeName.toLowerCase().trim()));

  const { website } = agencies.find(
    ({ socrataOwner }) => socrataOwner.trim() === agencyName.toUpperCase().trim(),
  );

  const daysOpen = moment().diff(moment(createdDate), 'days');

  return (
    <div className={classes.popupContent}>
      <Grid container direction="row" justifyContent="center" alignItems="center">
        <Grid item>
            <FiberManualRecordIcon
              className={classes.icon}
              style={{
                color,
                fontSize: 16,
              }}
            />
          </Grid>
          <Grid className={classes.requestType} item>
            {formattedTypeName}
          </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <p className={classes.sectionHeader}>Location:</p>
      <p className={classes.detailsStyles}>{toTitleCase(address)}</p>
      <p className={classes.sectionHeader}>Neighborhood Council:</p>
      <p className={classes.detailsStyles}>{councilName}</p>
      <Grid
        className={classes.info2}
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Grid item xs={6} style={{ font: 'Roboto', fontWeight: 500, fontSize: '16px', textDecoration: 'underline' }}>
          Service request:
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          #&nbsp;{srnumber}
        </Grid>
        <Grid className={classes.reportedAndClosed} item xs={6} >
          Reported on: {moment(createdDate).format('l')}
        </Grid>
        {/* <Grid item xs={6} style={{ textAlign: 'right' }}>
          {moment(createdDate).format('l')}
        </Grid> */}
        {closedDate ? (
          <>
            <Grid className={classes.reportedAndClosed}item xs={6}>
              Closed on: {moment(closedDate).format('l')}
            </Grid>
            {/* <Grid item xs={6} style={{ textAlign: 'right' }}>
              {moment(closedDate).format('l')}
            </Grid> */}
          </>
        ) : (
          <>
            <Grid item xs={6}>
              Status:
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'right' }}>
              {`Open (${renderDaysOpen(daysOpen)})`}
            </Grid>
          </>
        )}
        <Grid item xs={6}>
          Source:
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          {sourceName}
        </Grid>
        <Grid item xs={3}>
          Agency:
        </Grid>
        <Grid item xs={9} style={{ textAlign: 'right' }}>
          <Link
            href={website}
            aria-label={`${agencyName} website`}
            target="_blank"
            rel="noopener"
            color="inherit"
            underline="always"
          >
            {agencyName}
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}

RequestDetail.propTypes = {
  requestId: PropTypes.string,
  pinsInfo: PropTypes.shape({}),
  requestTypes: PropTypes.arrayOf(PropTypes.shape({})),
  agencies: PropTypes.arrayOf(PropTypes.shape({})),
  dispatchUpdatePinInfo: PropTypes.func.isRequired,
};

RequestDetail.defaultProps = {
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
)(withStyles(styles)(RequestDetail));
