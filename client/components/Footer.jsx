import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import {
  Container,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';

// TODO: pull style constants into mui theme
const useStyles = makeStyles({
  footer: {
    display: 'flex',
    verticalAlign: 'center',
    position: 'absolute',
    bottom: 0,
    height: '40px',
    width: '100%',
    backgroundColor: '#2A404E',
  },
  lastUpdated: {
    lineHeight: '40px',
    fontSize: '14px',
  }
});

// TODO: check with UI/UX re placement of social media, privacy policy links
const Footer = ({
  lastUpdated,
}) => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <Container maxWidth="xs">
        { lastUpdated && (
          <Typography className={classes.lastUpdated}>
            Data Updated Through:
            &nbsp;
            {moment(lastUpdated).format('MMMM Do YYYY, h:mm:ss a')}
          </Typography>
        )}
      </Container>
    </footer>
  )

}

const mapStateToProps = state => ({
  lastUpdated: state.metadata.lastPulled,
});

Footer.propTypes = {
  lastUpdated: PropTypes.string,
};

Footer.defaultProps = {
  lastUpdated: undefined,
};

export default connect(mapStateToProps, null)(Footer);
