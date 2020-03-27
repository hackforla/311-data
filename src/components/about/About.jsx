import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@components/common/Button';
import HeroImage from './HeroImage';
import WhatIs311Data from './WhatIs311Data';
import HowItWorks from './HowItWorks';

const About = () => (
  <div className="about-311">
    <HeroImage />
    <WhatIs311Data />
    <HowItWorks />
    <Link to="/">
      <Button id="about-311" label="Let's Get Started" />
    </Link>
  </div>
);

export default About;
