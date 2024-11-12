import PropTypes from 'prop-types';
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import cityBackground from '@assets/citybackgroundheader.png'

const useStyles = makeStyles(theme => ({
  headingBackground: {
    background: `url(${cityBackground}) no-repeat center center`,
    backgroundPosition: 'center 56%',
    backgroundSize: 'cover',
    height: '30vh',
    position: 'relative',
  },
  headingOverlayText: {
    left: '50%',
    color: 'white',
    position: 'absolute',
    textAlign: 'center',
    top: '50%',
    transform: 'translate(-50%, -70%)',
  },
  contentHeading: {
    fontWeight: theme.typography.fontWeightBold,
  },
}));

// TextHeading provides a standardized heading area and custom title
// below the Header on all content pages.

function TextHeadingFAQ({ children }) {
  const classes = useStyles();

  return (
    <div className={classes.headingBackground}>
      <div className={classes.headingOverlayText}>
        <Typography variant="h3" className={classes.contentHeading}>
          <div>{children}</div>
        </Typography>
      </div>
    </div>
  );
}

TextHeadingFAQ.defaultProps = {
  children: {},
};

TextHeadingFAQ.propTypes = {
  children: PropTypes.node,
};

export default TextHeadingFAQ;
