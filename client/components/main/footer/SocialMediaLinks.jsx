import React from 'react';

import TwitterSVG from '@assets/twitter-round.svg';
import FacebookSVG from '@assets/facebook-round.svg';

const SocialMediaLinks = () => (
  <div className="social-media-links">
    <a
      className="link"
      href="https://twitter.com/data_311"
      rel="external noopener noreferrer"
      target="_blank"
      aria-label="311 data twitter link"
    >
      <TwitterSVG className="icon" alt="twitter icon" />
    </a>
    <a
      className="link"
      href="https://www.facebook.com/311-Data-113014693792634"
      rel="external noopener noreferrer"
      target="_blank"
      aria-label="311 data facebook link"
    >
      <FacebookSVG className="icon" alt="facebook icon" />
    </a>
  </div>
);

export default SocialMediaLinks;
