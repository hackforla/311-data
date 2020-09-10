import React from 'react';
import { Link } from 'react-router-dom';

import SocialMediaLinks from './SocialMediaLinks';

const StaticFooter = () => (
  <footer className="navbar has-navbar-fixed-bottom">
    <div className="static-footer level-left">
      &copy;2020 311 Data
      &nbsp;|&nbsp;
      All Rights Reserved
      &nbsp;|&nbsp;
      <Link to="/privacy">&nbsp;Privacy Policy&nbsp;</Link>
      &nbsp;|&nbsp;
      Powered by volunteers from&nbsp;
      <a
        href="https://www.hackforla.org/#projects"
        aria-label="hack for la website"
        className="has-text-weight-bold"
        rel="external noopener noreferrer"
        target="_blank"
      >
        Hack for LA
      </a>
    </div>
    <SocialMediaLinks />
  </footer>
);

export default StaticFooter;
