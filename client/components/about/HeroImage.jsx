import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@components/common/Button';

const HeroImage = () => (
  <div className="splash-container">
    <div className="about-hero">
      <div className="logos">
          <img id="main-logo" src={require('../../assets/311-data-logo-background.png')} alt="311-Data logo"></img>
          <div className="presented-by-container">
            <h2>presented by</h2>
            <img id="hackforla-main-logo" src={require('../../assets/hackforla.png')} alt="Hack for LA logo"></img>
          </div>
      </div>
      <div className="splash-buttons">
        <Link to="/data">
          <Button id="launch-button" label="Launch" />
        </Link>
        <Link to="/about">
          <Button id="about-button" label="About" />
        </Link>
      </div>
    </div>
  </div>
);

export default HeroImage;
