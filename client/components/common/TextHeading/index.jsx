import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  headingBackground: {
    background: theme.palette.primary.main,
    backgroundPosition: 'top',
    height: '20vh',
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

const TextHeading = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.headingBackground}>
      <div className={classes.headingOverlayText}>
        <Typography variant="h3" className={classes.contentHeading}>
          {children}
        </Typography>
      </div>
    </div>
  );
};

TextHeading.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TextHeading;
