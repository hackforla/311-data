import PropTypes from 'prop-types';
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import cityBackground from '@assets/city_background_header.png'

const useStyles = makeStyles(theme => ({
  headingBackground: {
    background: `url(${cityBackground}) center 57% / cover`,
    backgroundPosition: 'center 57%',
    width: '100%',
    height: '240px',
    position: 'relative',
  },
  backdrop: {
    width: '100%',
    height: '100%',
    background: `linear-gradient(180deg, rgba(53, 82, 129, 0.4) 50%, rgba(41, 64, 79, 0.8) 100%, rgba(29, 63, 90, 0.4) 100%)`,
    backgroundPosition: 'center',
  },
  headingOverlayText: {
    left: '50%',
    color: 'white',
    position: 'absolute',
    textAlign: 'center',
    top: '50%',
    transform: 'translate(-50%, -70%)',
    zIndex: '1',
  },
  contentHeading: {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

// TextHeading provides a standardized heading area and custom title
// below the Header on all content pages.

function TextHeading({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.headingBackground}>
      <div className={classes.backdrop}></div>
      <div className={classes.headingOverlayText}>
        <Typography variant="h3" className={classes.contentHeading}>
          <div>
            {children}
          </div>
        </Typography>
      </div>
    </div>
  );
}

TextHeading.defaultProps = {
  children: {},
};

TextHeading.propTypes = {
  children: PropTypes.node,
};

export default TextHeading;
