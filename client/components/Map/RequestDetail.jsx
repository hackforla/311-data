/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { getPinInfoRequest } from '@reducers/data';
import toTitleCase from '@utils/toTitleCase';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Link from '@material-ui/core/Link';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CircularProgress from '@material-ui/core/CircularProgress';

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

class RequestDetail extends React.Component {
  componentDidUpdate(prev) {
    const { requestId, pinsInfo, dispatchGetPinInfo } = this.props;
    if (requestId === prev.requestId) return;

    if (requestId && !pinsInfo[requestId]) dispatchGetPinInfo(requestId);
  }

  renderDaysOpen = days => {
    switch (days) {
      case 0:
        return 'today';
      case 1:
        return `${days} day`;
      default:
        return `${days} days`;
    }
  }

  render() {
    const {
      classes, requestId, pinsInfo, requestTypes, agencies,
    } = this.props;

    if (!requestId) return null;

    if (!pinsInfo[requestId]) {
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
      srnumber,
      councilName,
      typeName,
      typeId: requestTypeId,
      agencyId: aId,
      agencyName,
      sourceName,
      createdDate,
      closedDate,
      address,
    } = pinsInfo[requestId];

    // regex fix to replace "/" in typeName
    const formattedTypeName = typeName.split('/').join(' ');

    const { color } = requestTypes.find(({ typeId }) => typeId === requestTypeId);
    const { website } = agencies.find(({ agencyId }) => agencyId === aId);
    const daysOpen = moment().diff(moment(createdDate), 'days');

    return (
      <div className={classes.popupContent}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
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
          <Grid item xs={6}>Service request:</Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            {srnumber}
          </Grid>
          <Grid item xs={6}>
            Reported on:
          </Grid>
          <Grid
            item
            xs={6}
            style={{ textAlign: 'right' }}
          >
            {moment(createdDate).format('l')}
          </Grid>
          {
            closedDate ? (
              <>
                <Grid item xs={6}>
                  Closed on:
                </Grid>
                <Grid
                  item
                  xs={6}
                  style={{ textAlign: 'right' }}
                >
                  {moment(closedDate).format('l')}
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs={6}>
                  Status:
                </Grid>
                <Grid
                  item
                  xs={6}
                  style={{ textAlign: 'right' }}
                >
                  {`Open (${this.renderDaysOpen(daysOpen)})`}
                </Grid>
              </>
            )
          }
          <Grid item xs={6}>Source:</Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            {sourceName}
          </Grid>
          <Grid item xs={3}>Agency:</Grid>
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
}

const mapStateToProps = state => ({
  pinsInfo: state.data.pinsInfo,
  requestTypes: state.metadata.requestTypes,
  agencies: state.metadata.agencies,
});

const mapDispatchToProps = dispatch => ({
  dispatchGetPinInfo: srnumber => dispatch(getPinInfoRequest(srnumber)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RequestDetail));

RequestDetail.propTypes = {
  requestId: PropTypes.number,
  pinsInfo: PropTypes.shape({}),
  requestTypes: PropTypes.arrayOf(PropTypes.shape({})),
  agencies: PropTypes.arrayOf(PropTypes.shape({})),
  dispatchGetPinInfo: PropTypes.func.isRequired,
};

RequestDetail.defaultProps = {
  requestId: null,
  pinsInfo: {},
  agencies: null,
  requestTypes: null,
};
