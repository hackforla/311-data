import React from 'react';
import PropTypes from 'proptypes';
import clx from 'classnames';

import Contact311Comparison from './Contact311Comparison';
import TimeToCloseComparison from './TimeToCloseComparison';
import FrequencyComparison from './FrequencyComparison';

const Comparison = ({
  fullWidth,
}) => (
  <div className={clx('comparison', { 'full-width': fullWidth })}>
    <FrequencyComparison />
    <Contact311Comparison />
    <TimeToCloseComparison />
  </div>
);

export default Comparison;

Comparison.propTypes = {
  fullWidth: PropTypes.bool,
};

Comparison.defaultProps = {
  fullWidth: false,
};
