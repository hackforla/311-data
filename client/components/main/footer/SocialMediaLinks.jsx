import React from 'react';

import TwitterSVG from '@assets/twitter-round.svg';
import FacebookSVG from '@assets/facebook-round.svg';

const SocialMediaLinks = () => (
  <span className="social-media-links">
    <a
      className="link"
      href="https://twitter.com/data_311"
      rel="external noopener noreferrer"
      target="_blank"
    >
      <TwitterSVG className="icon" alt="twitter icon" />
    </a>
    <a
      className="link"
      href="https://www.facebook.com/311-Data-113014693792634"
      rel="external noopener noreferrer"
      target="_blank"
    >
      <FacebookSVG className="icon" alt="facebook icon" />
    </a>
  </span>
);

export default SocialMediaLinks;
