import React from 'react';
import { makeStyles } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import colors from '@theme/colors';
import sharedLayout from '@theme/layout';
import TextHeading from '@components/common/TextHeading';

// Images
import empowerLaLogo from '@assets/empower_la_logo.png';
import hackForLaLogo from '@assets/hack_for_la_logo.png';
import codeForAmericaLogo from '@assets/code_for_america_logo.png';
import mobileAppIcon from '@assets/mobile_app_icon.png';
import databaseIcon from '@assets/database_icon.png';
import publishIcon from '@assets/publish_icon.png';
import upliftIcon from '@assets/uplift_icon.png';
import visualizeIcon from '@assets/visualize_icon.png';

// TODO: Revisit adding shared standard styles once those are decided.
const useStyles = makeStyles({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    '& img': {
      maxWidth: '100%',
      display: 'block',
      margin: '0 auto',
    },
  },
  relParent: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  absChildCenter: {
    position: 'absolute',
    left: '50%',
  },
});

const About = () => {
  const classes = { ...useStyles(), ...sharedLayout() };

  return (
    <>
      <TextHeading className={classes.contentMarginTop}>
        About 311DATA
      </TextHeading>

      <Grid container alignItems="center" justify="center" direction="column">
        <Grid item>
          <Container component="main" className={classes.contentIntroBody} maxWidth="md">
            <Grid container alignItems="center" justify="center" direction="column">
              <Grid item>
                <div className={classes.contentIntroBody}>
                  <Typography variant="body1">
                    Each day, Los Angelenos report thousands of 311
                    requests all across LA to resolve issues such as
                    illegal dumping and homeless encampments in their
                    neighborhoods. These requests are then received by
                    relevant agencies, such as the Police, Building and
                    Safety, or Department of Transportation. The agency
                    responds to the request, addresses it, and then closes
                    it once it is fixed.  The expansive amount of data
                    associated with these 311 requests is available online.
                    However, it is difficult to make actionable at the neighborhood
                    level. Thanks to the mayor&apos;s Open Data Initiative,
                    the expansive amount of data associated with these 311
                    requests is available online. The mayor has encouraged
                    us to create apps with this data, and that&apos;s where
                    this project comes&nbsp;in.
                  </Typography>
                </div>
                {/* <h2 style={{ color: '#1D6996', textAlign: 'center' }}>Partners</h2> */}
                <div align="center">
                  <Typography style={{ color: colors.primaryDark }}>Partners</Typography>
                </div>
                <p style={{ paddingBottom: '1.625rem' }}>
                  To empower local residents and Neighborhood Councils to
                  make informed decisions about how to improve their communities
                  using an easy-to-use application, EmpowerLA partnered with Hack
                  For LA  to create the 311 Data project. The 311 Data project makes
                  navigating the wealth of 311 data easier using an open source
                  application built and maintained by volunteers throughout our&nbsp;community.
                </p>
              </Grid>
            </Grid>
            <Grid container style={{ paddingBottom: '6rem' }} justify="space-between">
              <Grid item xs={12} md={4}>
                <img src={empowerLaLogo} width={362} alt="Empower LA" />
              </Grid>
              <Grid item xs={12} md={4}>
                <img src={hackForLaLogo} width={97} alt="Hack for LA" />
              </Grid>
              <Grid item xs={12} md={4}>
                <img src={codeForAmericaLogo} width={202} alt="Code for America" />
              </Grid>
            </Grid>
            <h2 style={{ color: '#1D6996', textAlign: 'center' }}>How it works</h2>

            <Grid container style={{ paddingBottom: '4rem' }} justify="space-between">
              <Grid item sm={12} md={2} align="center">
                <img src={mobileAppIcon} width={75} alt="Mobile App" />
                <p>
                  You and other members of your community post reports via
                  the City’s easy-to-use mobile application.
                </p>
              </Grid>
              <Grid item sm={12} md={2} align="center">
                <img src={databaseIcon} width={75} alt="Mobile App" />
                <p>
                  Your reports are consolidated by the City and entered into
                  a central database. All requests are assigned to the
                  appropriate department to resolve.
                </p>
              </Grid>
              <Grid item sm={12} md={2} align="center">
                <img src={publishIcon} width={75} alt="Mobile App" />
                <p>
                  Once data from each department is sorted,  the City then
                  publishes it as raw information.
                </p>
              </Grid>
              <Grid item sm={12} md={2} align="center">
                <img src={visualizeIcon} width={75} alt="Mobile App" />
                <p>
                  Our site draws data from the City’s database to create
                  easy-to-view visualizations and files to export.
                </p>
              </Grid>
              <Grid item sm={12} md={2} align="center">
                <img src={upliftIcon} width={75} alt="Mobile App" />
                <p>
                  You now have access to digestable data. Communities
                  are empowered and equipped to identify areas of improvement to uplift and thrive.
                </p>
              </Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>
    </>
  );
};

export default About;
