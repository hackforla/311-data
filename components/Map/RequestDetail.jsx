/* eslint-disable react/prop-types */
import React, { useContext, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CircularProgress from '@material-ui/core/CircularProgress';
import toTitleCase from '@utils/toTitleCase';
import { updatePinInfo } from '@reducers/data';
import DbContext from '@db/DbContext';
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

const RequestDetail = ({
  classes,
  requestId,
  pinsInfo,
  requestTypes,
  agencies,
  // dispatchGetPinInfoRequest,
  dispatchUpdatePinInfo,
}) => {
  const { conn } = useContext(DbContext);
  const getPinInfo = useCallback(async () => {
    try {
      const getPinsInfoSQL = `SELECT * FROM requests WHERE TRIM(SRNumber) = '${requestId}'`;

      const pinsInfoAsArrowTable = await conn.query(getPinsInfoSQL);
      const newPinsInfo = ddbh.getTableData(pinsInfoAsArrowTable);

      if (
        !!newPinsInfo === true
        && Array.isArray(newPinsInfo)
        && newPinsInfo.length > 0
      ) {
        dispatchUpdatePinInfo(newPinsInfo[0]);
      }
    } catch (e) {
      console.error('RequestDetail: Error occurred: ', e);
    }
  }, [requestId, conn, dispatchUpdatePinInfo]);

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
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <Grid className={classes.requestType} item>
          {formattedTypeName}
        </Grid>
        <Grid item>
          <FiberManualRecordIcon
            className={classes.icon}
            style={{
              color,
              fontSize: 16,
            }}
          />
        </Grid>
      </Grid>
      <Divider className={classes.divider} />
      <p className={classes.info1}>{toTitleCase(address)}</p>
      <p className={classes.councilName}>{councilName}</p>
      <Grid
        className={classes.info2}
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
      >
        <Grid item xs={6}>
          Service request:
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          {srnumber}
        </Grid>
        <Grid item xs={6}>
          Reported on:
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          {moment(createdDate).format('l')}
        </Grid>
        {closedDate ? (
          <>
            <Grid item xs={6}>
              Closed on:
            </Grid>
            <Grid item xs={6} style={{ textAlign: 'right' }}>
              {moment(closedDate).format('l')}
            </Grid>
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
};

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
});

const mapDispatchToProps = dispatch => ({
  dispatchUpdatePinInfo: pinInfo => dispatch(updatePinInfo(pinInfo)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(RequestDetail));
