import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { disableSplashPage } from '@reducers/ui';

import { Link } from 'react-router-dom';
import Button from '@components/common/Button';

import HeroImage from './HeroImage';
import WhatIs311Data from './WhatIs311Data';
import HowItWorks from './HowItWorks';


const About = ({
  disableSplash,
}) => (
  <div className="about-311">
    <HeroImage />
    <WhatIs311Data />
    <HowItWorks />
    <Link to="/">
      <Button id="about-311" label="Let's Get Started" handleClick={disableSplash} />
    </Link>
  </div>
);


const mapDispatchToProps = dispatch => ({
  disableSplash: () => dispatch(disableSplashPage()),
});

About.propTypes = {
  disableSplash: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(About);
