import React from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

const ShareableLinkCreator = ({
  requestStatus,
}) => (
  <>
    <Button
      variant="contained"
      onClick={() => {
        // const url = new URL(`${process.env.API_URL}/map`);
        const url = new URL(`${window.location.href.split('?')[0]}`);
        if (requestStatus.councilId) {
          url.searchParams.append('councilId', requestStatus.councilId);
        }
        for (let requestTypeIndex = 1; requestTypeIndex < 13; requestTypeIndex += 1) {
          if (requestStatus.requestTypes[requestTypeIndex] === false) {
            url.searchParams.append(`rtId${requestTypeIndex}`, requestStatus.requestTypes[requestTypeIndex]);
          }
        }
        url.searchParams.append('requestStatusOpen', requestStatus.requestStatus.open);
        url.searchParams.append('requestStatusClosed', requestStatus.requestStatus.closed);
        url.searchParams.append('startDate', requestStatus.startDate);
        url.searchParams.append('endDate', requestStatus.endDate);
        navigator.clipboard.writeText(url);
      }}
    >
      Get Shareable Link
    </Button>
  </>
);

const mapStateToProps = state => ({
  requestStatus: state.filters,
});

export default connect(
  mapStateToProps,
)(ShareableLinkCreator);

ShareableLinkCreator.propTypes = {
  requestStatus: PropTypes.shape({
    requestStatus: PropTypes.shape({
      open: PropTypes.bool.isRequired,
      closed: PropTypes.bool.isRequired,
    }).isRequired,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    councilId: PropTypes.number,
    requestTypes: PropTypes.shape({
      1: PropTypes.bool,
      2: PropTypes.bool,
      3: PropTypes.bool,
      4: PropTypes.bool,
      5: PropTypes.bool,
      6: PropTypes.bool,
      7: PropTypes.bool,
      8: PropTypes.bool,
      9: PropTypes.bool,
      10: PropTypes.bool,
      11: PropTypes.bool,
      12: PropTypes.bool,
    }),
  }).isRequired,
};
