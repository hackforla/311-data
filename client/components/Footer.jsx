import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import {
  Container,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  footer: {
    position: 'fixed',
    bottom: 0,
    height: theme.footer.height,
    width: '100%',
    backgroundColor: theme.palette.primary.dark,
  },
  lastUpdated: {
    color: theme.palette.text.dark,
    lineHeight: theme.footer.height,
    fontSize: '14px',
    fontFamily: 'Roboto',
  },
}));

// TODO: check with UI/UX re placement of social media, privacy policy links
const Footer = ({
  lastUpdated,
}) => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      { lastUpdated && (
        <Container maxWidth="xs">
          <Typography className={classes.lastUpdated}>
            Data Updated Through:
            &nbsp;
            {moment(lastUpdated).format('MMMM Do YYYY, h:mm:ss a')}
          </Typography>
        </Container>
      )}
    </footer>
  );
};

const mapStateToProps = state => ({
  lastUpdated: state.metadata.lastPulledLocal,
});

Footer.propTypes = {
  lastUpdated: PropTypes.string,
};

Footer.defaultProps = {
  lastUpdated: undefined,
};

export default connect(mapStateToProps, null)(Footer);
