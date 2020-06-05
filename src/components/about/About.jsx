import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { disableSplashPage } from '@reducers/ui';

import { Link } from 'react-router-dom';
import Button from '@components/common/Button';
import Icon from '@components/common/Icon';

import HeroImage from './HeroImage';
import WhatIs311Data from './WhatIs311Data';
import HowItWorks from './HowItWorks';


const About = ({
  disableSplash,
}) => {
  const aboutRef = React.createRef();

  const scrollTo = ref => {
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="about-311">
      <HeroImage />
      <div className="about-scroll-wrapper bounce">
        <Icon
          id="about-scroll"
          icon="arrow-alt-circle-down"
          handleClick={() => scrollTo(aboutRef)}
          size="large"
          iconSize="3x"
        />
      </div>
      <WhatIs311Data ref={aboutRef} />
      <HowItWorks />
      <Link to="/">
        <Button id="about-311" label="Let's Get Started" handleClick={disableSplash} />
      </Link>
    </div>
  );
};


const mapDispatchToProps = dispatch => ({
  disableSplash: () => dispatch(disableSplashPage()),
});

About.propTypes = {
  disableSplash: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(About);
