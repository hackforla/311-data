import React, { forwardRef } from 'react';
import EmpowerLA from '@assets/empowerla.png';
import HackforLA from '@assets/hackforla.png';
import CFALogo from '@assets/cfa-logo.png';

// eslint-disable-next-line react/display-name
const WhatIs311Data = forwardRef((props, ref) => (
  <div className="main-text" ref={ref}>
    <h1>What is 311 Data?</h1>
    <p>
      Each day, Los Angelenos report thousands of 311 requests all across LA to resolve
      issues such as illegal dumping and graffiti in their neighborhoods. These requests
      are then received by relevant agencies, such as the Police, Building and Safety, or
      Department of Transportation. The agency responds to the request, addresses it, and
      then closes it once it is fixed. Thanks to the mayor&apos;s
      {' '}
      <a href="https://data.lacity.org/" aria-label="los angeles open data website">Open Data Initiative</a>
      {', '}
      the expansive amount of data associated with these
      311 requests is available online. The mayor has encouraged us to create apps with this
      data, and that&apos;s where this project comes in.
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
      <a href="https://empowerla.org/councils/" aria-label="empower LA neighborhood councils website">
        Neighborhood Councils
      </a>
      {' '}
      to make informed decisions about how to improve their communities using an easy-to-use
      application,
      {' '}
      <a href="https://www.hackforla.org/" aria-label="hack for LA website">Hack For LA</a>
      {' '}
      partnered with
      {' '}
      <a href="https://empowerla.org/" aria-label="empower LA website">EmpowerLA</a>
      {' '}
      to create the
      {' '}
      <a href="https://www.hackforla.org/projects/311-data" aria-label="311 data project website">311 Data project</a>
      .
      {' '}
      The 311 Data project makes navigating the wealth of 311 data easier using an open source
      application built and maintained by volunteers throughout our community.
      <br />
      <br />
      Much like the neighborhoods we serve, our volunteers are professionals that work hard to
      empower their communities and gain experience that can be applied in the workforce.
      This symbiotic partnership is ongoing and serves to develop ideas for additional applications,
      like our
      {' '}
      <a href="https://hackforla.github.io/311-report/" aria-label="311 data report tool alpha website">Report Tool Alpha</a>
      {' '}
      or opportunities for our data science team to analyze additional data.
    </p>
  </div>
));

export default WhatIs311Data;
