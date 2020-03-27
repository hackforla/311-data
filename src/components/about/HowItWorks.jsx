import React from 'react';
import mobile from '@assets/mobile.svg';
import dataserver from '@assets/dataserver.svg';
import growth from '@assets/growth.svg';
import datavisualization from '@assets/datavisualization.svg';

const HowItWorks = () => (
  <div className="how-it-works">
    <h1>How It Works</h1>
    <div className="grid-container">
      <img src={mobile} alt="" />
      <img src={dataserver} alt="" />
      <img src={datavisualization} alt="" />
      <img src={growth} alt="" />
      <p>Community members post reports via the City&apos;s easy-to-use mobile application.</p>
      <p>
        Reports are consolidated and entered into a central database and requests are
        assigned to the appropriate department to resolve.
      </p>
      <p>
        Our site draws data from the City’s database to create easy-to-view visualizations and
        files to export at the neighborhood level.
      </p>
      <p>
        Communities are empowered and equipped to identify areas of improvement to uplift and
        thrive.
      </p>
    </div>
  </div>
);

export default HowItWorks;
