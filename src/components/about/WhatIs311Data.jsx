import React from 'react';
import EmpowerLA from '@assets/empowerla.png';
import HackforLA from '@assets/hackforla.png';
import CFALogo from '@assets/cfa-logo.png';

const WhatIs311Data = () => (
  <div className="main-text">
    <h1>What is 311 Data?</h1>
    <p>
      Each day, Los Angelenos report thousands of 311 requests all across LA to resolve
      issues such as illegal dumping and graffiti in their neighborhoods. These requests
      are then received by relevant agencies, such as the Police, Building and Safety, or
      Department of Transportation. The agency responds to the request, addresses it, and
      then closes it once it is fixed. The expansive amount of data associated with these
      311 requests is available online. However, it is difficult to make actionable at the
      neighbourhood level.
    </p>
    <div className="logos columns level">
      <div className="column level-item">
        <img src={EmpowerLA} alt="EmpowerLA Neighborhood Councils Logo" />
      </div>
      <div className="column level-item">
        <img src={HackforLA} alt="Hack for LA Logo" />
      </div>
      <div className="column level-item">
        <img src={CFALogo} alt="Code For America Logo" />
      </div>
    </div>
    <p>
      To empower local residents and
      {' '}
      <a href="https://empowerla.org/councils/">Neighborhood Councils</a>
      {' '}
      to make informed decisions about how to improve their communities using an easy-to-use
      application,
      {' '}
      <a href="https://www.hackforla.org/">Hack For LA</a>
      {' '}
      partnered with
      {' '}
      <a href="https://empowerla.org/">EmpowerLA</a>
      {' '}
      to create the
      {' '}
      <a href="https://www.hackforla.org/projects/311-data">311 Data project</a>
      .
      {' '}
      The 311 Data project makes navigating the wealth of 311 data easier using an open source
      application built and maintained by volunteers throughout our community.
    </p>
  </div>
);

export default WhatIs311Data;
