import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@components/common/Button';
import Icon from '@components/common/Icon';

import HeroImage from './HeroImage';
import WhatIs311Data from './WhatIs311Data';
import HowItWorks from './HowItWorks';

const About = () => {
  return (
    <div className="about-311">
      <WhatIs311Data />
      <HowItWorks />
      <Link to="/data">
        <Button id="about-311" label="Let's Get Started" />
      </Link>
    </div>
  );
};

export default About;
