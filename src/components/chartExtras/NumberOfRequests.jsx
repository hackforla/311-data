import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';

function addCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const NumberOfRequests = ({
  numRequests,
}) => (
  <div className="chart-extra number-of-requests">
    <h1>Number of Requests</h1>
    <div className="requests-box-container">
      <span className="requests-box">
        { addCommas(numRequests) }
      </span>
    </div>
  </div>
);

const mapStateToProps = state => ({
  numRequests: Object.values(state.data.counts.type).reduce((p, c) => p + c, 0),
});

export default connect(mapStateToProps)(NumberOfRequests);

NumberOfRequests.propTypes = {
  numRequests: PropTypes.number,
};

NumberOfRequests.defaultProps = {
  numRequests: 0,
};
