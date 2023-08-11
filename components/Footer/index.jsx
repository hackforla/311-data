import React from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import LastUpdated from '@components/Footer/LastUpdated';
import SocialMediaLinks from '@components/Footer/SocialMediaLinks';

// Footer should make use of style overrides to look the same regardless of light/dark theme.
const useStyles = makeStyles(theme => ({
  footer: {
    position: 'fixed',
    bottom: 0,
    height: theme.footer.height,
    width: '100%',
    backgroundColor: theme.palette.primary.dark,
    zIndex: 1,
  },
  footerSpacing: {
    height: theme.footer.height,
  },
  copyright: {
    fontWeight: theme.typography.fontWeightMedium,
    lineHeight: theme.footer.height,
    color: theme.palette.text.dark,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: theme.spacing(0, 2, 0),
  },
  copyrightContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  link: {
    color: theme.palette.text.dark,
    textDecoration: 'none',
  },
}));

// TODO: check with UI/UX re placement of social media, privacy policy links
const Footer = () => {
  const classes = useStyles();
  const currentDate = new Date();

  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.copyrightContainer}>
          <Typography variant="body2" className={classes.copyright}>
            &#169;
            {currentDate.getFullYear()}
            &nbsp;311 Data&nbsp;&nbsp;|&nbsp;&nbsp;All Rights
            Reserved&nbsp;&nbsp;|&nbsp;&nbsp;
            <Link to="/privacy" className={classes.link}>
              Privacy Policy
            </Link>
            &nbsp;&nbsp;|&nbsp;&nbsp;Powered by volunteers from Hack for LA
          </Typography>
        </div>

        <LastUpdated />
        <div>
          <SocialMediaLinks classes={classes} />
        </div>
      </div>
    </footer>
  );
};

const mapStateToProps = state => ({
  lastUpdated: state.metadata.lastPulledLocal,
});

export default connect(mapStateToProps, null)(Footer);
