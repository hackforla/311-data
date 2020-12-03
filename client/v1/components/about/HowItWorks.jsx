import React from 'react';
// React-svg-loader for Webpack bundles SVGs and makes them available as
// React components which simply return the imported SVG paths.
import MobileSVG from '@assets/aboutmobile.svg';
import DataServerSVG from '@assets/aboutdataserver.svg';
import GrowthSVG from '@assets/aboutgrowth.svg';
import DataVizSVG from '@assets/aboutdatavis.svg';

const HowItWorks = () => (
  <div className="how-it-works">
    <h1>How It Works</h1>
    <div className="grid-container" role="presentation">
      <MobileSVG role="img" aria-label="Mobile Telephone" />
      <DataServerSVG role="img" aria-label="Cloud Database" />
      <DataVizSVG role="img" aria-label="Laptop Computer Displaying Data Visualizations" />
      <GrowthSVG role="img" aria-label="Upturned Hand Holding Seedling" />
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
