import React from 'react';
import PropTypes from 'proptypes';

const TotalByDayOfWeek = ({ data }) => (
  <>
    <div>Total Requests by Day of The Week</div>
    {
      // Observable code goes here
      // https://observablehq.com/d/8236de092b1f9523#cell-237
    }
    <ul>
      {data?.map(request => (
        <li key={request.SRNumber}>{request.SRNumber}</li>
      ))}
    </ul>
  </>
);

TotalByDayOfWeek.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default TotalByDayOfWeek;
