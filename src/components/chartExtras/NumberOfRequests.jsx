import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import InfoTitle from '@components/common/InfoTitle';

function addCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const NumberOfRequests = ({
  numRequests,
}) => (
  <div className="chart-extra number-of-requests">
    <InfoTitle
      title="Number of Requests"
      infoText="This is the total number of requests within the selected filters."
    />
    <div className="requests-box-container">
      <span className="requests-box">
        { addCommas(numRequests) }
      </span>
    </div>
  </div>
);

const mapStateToProps = state => ({
  numRequests: Object.values(state.data.counts.type || {}).reduce((p, c) => p + c, 0),
});

export default connect(mapStateToProps)(NumberOfRequests);

NumberOfRequests.propTypes = {
  numRequests: PropTypes.number,
};

NumberOfRequests.defaultProps = {
  numRequests: 0,
};
