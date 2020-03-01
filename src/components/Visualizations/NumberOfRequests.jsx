import React from 'react';
import PropTypes from 'proptypes';

function addCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const NumberOfRequests = ({
  numRequests,
}) => (
  <div className="number-of-requests">
    <h1 className="has-text-centered">Number of Requests</h1>
    <div className="has-text-centered has-text-weight-bold">
      <span className="requests-box">
        { addCommas(numRequests) }
      </span>
    </div>
  </div>
);

export default NumberOfRequests;

NumberOfRequests.propTypes = {
  numRequests: PropTypes.number.isRequired,
};

NumberOfRequests.defaultProps = {
  numRequests: 1285203,  // until we get data
};
