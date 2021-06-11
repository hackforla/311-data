import React from 'react';

import TwitterSVG from '../assets/twitter-round.svg';
import FacebookSVG from '../assets/facebook-round.svg';

const SocialMediaLinks = () => (
  <div>
    <a
      className="link"
      href="https://twitter.com/data_311"
      rel="external noopener noreferrer"
      target="_blank"
      aria-label="311 data twitter link"
    >
      <img className="icon" alt="twitter icon" src={TwitterSVG}/>
    </a>
    <a
      className="link"
      href="https://www.facebook.com/311-Data-113014693792634"
      rel="external noopener noreferrer"
      target="_blank"
      aria-label="311 data facebook link"
    >
      <img className="icon" alt="facebook icon" src={FacebookSVG}/>
    </a>
  </div>
);

export default SocialMediaLinks;