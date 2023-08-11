import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import TwitterSVG from '../assets/twitter-round.svg';
import FacebookSVG from '../assets/facebook-round.svg';

const useStyles = makeStyles(theme => ({
  socialMedia: {
    display: 'flex',
    flexDirection: 'row',
    lineHeight: theme.footer.height,
    justifyContent: 'space-between',
    width: '37px',
    marginLeft: '5px',
    alignContent: 'center',
  },
  image: {
    filter:
      ' invert(85%) sepia(0%) saturate(0%) hue-rotate(53deg) brightness(94%) contrast(88%)',
    width: '16px',
    height: '16px',
    verticalAlign: 'middle',
  },
}));

const SocialMediaLinks = () => {
  const classes = useStyles();
  return (
    <div className={classes.socialMedia}>
      <a
        href="https://www.facebook.com/311-Data-113014693792634"
        target="_blank"
        rel="external noopener noreferrer"
        aria-label="311 data facebook link"
      >
        <img className={classes.image} src={FacebookSVG} alt="FaceBook Icon" />
      </a>
      <a
        href="https://twitter.com/data_311"
        rel="external noopener noreferrer"
        target="_blank"
        aria-label="311 data twitter link"
      >
        <img className={classes.image} src={TwitterSVG} alt="Twitter Icon" />
      </a>
    </div>
  );
};

export default SocialMediaLinks;
