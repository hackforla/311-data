import React from 'react';
import { connect } from 'react-redux';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';
import { Link } from 'react-router-dom';
import LastUpdated from '@components/Footer/LastUpdated';
import SocialMediaLinks from '@components/Footer/SocialMediaLinks';
import HFLALogo from '@assets/hack_for_la_logo.png';

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
    display: 'flex',
    gap: theme.spacing(1),
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
    alignItems: 'center',
  },
  link: {
    color: theme.palette.text.dark,
    textDecoration: 'none',
  },
  logo: {
    marginInline: theme.spacing(1),
  },
}));

function Footer() {
  const classes = useStyles();
  const currentDate = new Date();
  const footerItems = [
    { text: `\u00a9 ${currentDate.getFullYear()} 311 Data` },
    { text: 'All Rights Reserved' },
    { text: 'Privacy Policy', href: '/privacy' },
    { text: 'Powered by volunteers from Hack for LA' },
  ];

  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.copyrightContainer}>
          <Typography variant="body2" className={classes.copyright}>
            {footerItems.map(({ text, href }, i) => {
              const nonBreakingText = text.replaceAll(' ', '\u00a0');

              return (
                <React.Fragment key={text}>
                  {href ? (
                    <Link to={href} className={classes.link}>
                      {nonBreakingText}
                    </Link>
                  ) : (
                    <span>{nonBreakingText}</span>
                  )}

                  {i === footerItems.length - 1 ? null : <span>|</span>}
                </React.Fragment>
              );
            })}
          </Typography>

          <img
            src={HFLALogo}
            alt="Hack for LA logo"
            width="24"
            className={classes.logo}
          />
        </div>

        <LastUpdated />
        <div>
          <SocialMediaLinks classes={classes} />
        </div>
      </div>
    </footer>
  );
}

const mapStateToProps = state => ({
  lastUpdated: state.metadata.lastPulledLocal,
});

export default connect(mapStateToProps, null)(Footer);
