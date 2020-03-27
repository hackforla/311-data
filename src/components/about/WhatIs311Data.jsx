import React from 'react';

const WhatIs311Data = () => (
  <div className="main-text">
    <h1>What is 311 Data?</h1>
    <p>
      Each day, residents of the City of LA submit thousands of requests to deal with issues
      such as illegal dumping and homeless encampments. These requests are received by the
      relevant agencies, such as the Police, Building and Safety, or Department of Transportation.
      The agency responds to the request, addresses it, and then closes it when resolved. The data
      associated with some of these requests is available online, but is difficult to make
      actionable at the neighborhood level.
    </p>
    <p>
      That’s where this site comes in.
      {' '}
      <a href="https://empowerla.org/">EmpowerLA</a>
      {' '}
      has partnered with
      {' '}
      <a href="https://www.hackforla.org/">Hack For LA</a>
      {' '}
      to create the
      {' '}
      <a href="https://www.hackforla.org/projects/311-data">311 Data project</a>
      {' '}
      to empower local residents and Neighborhood Councils to make informed decisions about how to
      improve their communities using an intuitive app. We make navigating the wealth of 311 data
      easier using an open source app built and maintained by volunteers throughout our community.
    </p>
  </div>
);

export default WhatIs311Data;
