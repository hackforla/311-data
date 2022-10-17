import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import coverImage from '@assets/contact_bg.png';

const useStyles = makeStyles(theme => ({
  contactImageCover: {
    height: '25vh',
    backgroundImage: `url(${coverImage})`,
    backgroundPosition: 'top',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    position: 'relative',
  },
  contactImageOverlayText: {
    color: theme.palette.background.default,
    left: '50%',
    fontSize: '40px',
    fontWeight: 'bold',
    position: 'absolute',
    textAlign: 'center',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

const ContactImage = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.contactImageCover}>
      <div className={classes.contactImageOverlayText}>
        <span>{children}</span>
      </div>
    </div>
  );
};

ContactImage.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ContactImage;
