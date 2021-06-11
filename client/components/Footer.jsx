import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import { Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { Link } from 'react-router-dom';
import SocialMediaLinks from './SocialMediaLinks';
import TwitterSVG from '../assets/twitter-round.svg';
import FacebookSVG from '../assets/facebook-round.svg';

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
  copyright: {
    fontSize: '14px',
    lineHeight: theme.footer.height,
    color: theme.palette.text.dark,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialMedia: {
    display: 'flex',
    flexDirection: 'row',
    lineHeight: theme.footer.height,
    justifyContent: 'space-between',
    width: '40px',
    marginLeft: '10px',
    alignContent: 'center',
  },
  copyrightContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    filter:
      ' invert(85%) sepia(0%) saturate(0%) hue-rotate(53deg) brightness(94%) contrast(88%)',
  },
  link: {
    color: theme.palette.text.dark,
    textDecoration: 'none',
  },
}));

// TODO: check with UI/UX re placement of social media, privacy policy links
const Footer = ({ lastUpdated }) => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      {lastUpdated && (
        <Container maxWidth='md' className={classes.container}>
          <div className={classes.copyrightContainer}>
            <Typography className={classes.copyright}>
              &#169;311 Data &nbsp;&nbsp;All Rights Reserved |&nbsp;
              <Link to='/privacy' className={classes.link}>
                Privacy Policy
              </Link>{' '}
              | Powered by volunteers from Hack for LA |
            </Typography>
            <div className={classes.socialMedia}>
              <a
                href='https://www.facebook.com/311-Data-113014693792634'
                target='_blank'
              >
                <img
                  className={classes.image}
                  src={FacebookSVG}
                  style={{
                    width: '16px',
                    height: '16px',
                    verticalAlign: 'middle',
                    fill: 'pink',
                  }}
                />
              </a>
              <a href='https://twitter.com/data_311' target='_blank'>
                <img
                  className={classes.image}
                  src={TwitterSVG}
                  style={{
                    width: '16px',
                    height: '16px',
                    verticalAlign: 'middle',
                  }}
                />
              </a>
            </div>
          </div>
          <Typography className={classes.lastUpdated}>
            Data updated: &nbsp;
            {moment(lastUpdated).format('MM/DD/YY')}
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
