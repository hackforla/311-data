import React from 'react';

import Contact311Comparison from './Contact311Comparison';
import TimeToCloseComparison from './TimeToCloseComparison';
import FrequencyComparison from './FrequencyComparison';
import TotalRequestsComparison from './TotalRequestsComparison';

const Comparison = () => (
  <div className="comparison">
    <TotalRequestsComparison />
    <FrequencyComparison />
    <Contact311Comparison />
    <TimeToCloseComparison />
  </div>
);

export default Comparison;
