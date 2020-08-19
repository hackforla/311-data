import React from 'react';

const HeroImage = () => (
  <div className="about-hero">
    <div className="logos">
        <img id="main-logo" src={require('../../assets/311-data-logo-background.png')} alt="311-Data logo"></img>
        <div className="presented-by-container">
          <h2>presented by</h2>
          <img id="hackforla-main-logo" src={require('../../assets/hackforla.png')} alt="Hack for LA logo"></img>
        </div>
    </div>
  </div>
);

export default HeroImage;
