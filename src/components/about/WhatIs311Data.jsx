import React from 'react';
import EmpowerLaSVG from '@assets/empowerla.svg';
import HackforLaSVG from '@assets/hackforla.svg';

const WhatIs311Data = () => (
  <div className="main-text">
    <h1>What is 311 Data?</h1>
    <p>
      Each day, Los Angelenos report thousands of 311 requests all across LA to
      resolve issues such as illegal dumping and homeless encampments in their neighborhoods.
      These requests are then received by relevant agencies, such as the Police, Building
      and Safety, or Department of Transportation. The agency responds to the request, addresses
      it, and then closes it once it is fixed. The expansive amount of data associated with these
      311 requests is available online. However, it is difficult to make actionable at the
      neighborhood level.
    </p>
    <div className="logos level">
      <span className="level-item">
        <EmpowerLaSVG />
      </span>
      <span className="level-item">
        <HackforLaSVG />
      </span>
    </div>
    <p>
      To empower local residents and Neighborhood Councils to make informed decisions about how
      to improve their communities using an easy-to-use application,
      {' '}
      <a href="https://empowerla.org/">EmpowerLA</a>
      {' '}
      partnered with
      {' '}
      <a href="https://www.hackforla.org/">Hack For LA</a>
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
