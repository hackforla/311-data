import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import fonts from '@theme/fonts';
import sharedLayout from '@theme/layout';
import TextHeading from '@components/common/TextHeading';
import ContentBody from '@components/common/ContentBody';

// Images
import empowerLaLogo from '@assets/empower_la_logo.png';
import hackForLaLogo from '@assets/hack_for_la_logo.png';
import codeForAmericaLogo from '@assets/code_for_america_logo.png';
import mobileAppIcon from '@assets/mobile_app_icon.png';
import databaseIcon from '@assets/database_icon.png';
import publishIcon from '@assets/publish_icon.png';
import upliftIcon from '@assets/uplift_icon.png';
import visualizeIcon from '@assets/visualize_icon.png';

const useStyles = makeStyles(theme => ({
  contentTitle: {
    fontSize: fonts.size.jumbo,
    fontWeight: theme.typography.fontWeightMedium,
  },
  imageStyle: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

const About = () => {
  const classes = { ...sharedLayout(), ...useStyles() };

  return (
    <>
      <TextHeading>
        About 311DATA
      </TextHeading>

      <ContentBody maxWidth="md">
        <Grid container alignItems="center" justify="center" direction="column">
          <Grid item>
            <Typography variant="body1" paragraph>
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
            <div className={classes.marginTopLarge} align="center">
              <Typography variant="h3" className={clsx(classes.contentHeader, classes.contentTitle)}>
                Partners
              </Typography>
            </div>
            <div className={classes.marginTopMedium}>
              <Typography variant="body1" paragraph>
                To empower local residents and Neighborhood Councils to
                make informed decisions about how to improve their communities
                using an easy-to-use application, EmpowerLA partnered with Hack
                For LA  to create the 311 Data project. The 311 Data project makes
                navigating the wealth of 311 data easier using an open source
                application built and maintained by volunteers throughout our&nbsp;community.
              </Typography>
            </div>
          </Grid>
        </Grid>

        {/* Inserting 3 images horizontally here  */}
        <Grid container className={classes.marginTopSmall} justify="space-between">
          <Grid item xs={12} md={4} align="left">
            <img src={empowerLaLogo} width={362} alt="Empower LA" />
          </Grid>
          <Grid item xs={12} md={4} align="right">
            <img src={hackForLaLogo} width={97} alt="Hack for LA" />
          </Grid>
          <Grid item xs={12} md={4} align="right">
            <img src={codeForAmericaLogo} width={202} alt="Code for America" />
          </Grid>
        </Grid>
        <div className={classes.marginTopLarge} align="center">
          <Typography variant="h3" className={clsx(classes.contentHeader, classes.contentTitle)}>
            How it works
          </Typography>
        </div>
      </ContentBody>

      <ContentBody maxWidth="lg" hasTopMargin={false}>
        <Grid container className={classes.marginTopLarge} justify="space-between">
          <Grid item sm={12} md={2}>
            <img className={classes.imageStyle} src={mobileAppIcon} width={75} alt="Mobile App" />
            <Typography variant="body1" paragraph>
              You and other members of your community post reports via
              the City’s easy-to-use mobile application.
            </Typography>
          </Grid>
          <Grid item sm={12} md={2}>
            <img className={classes.imageStyle} src={databaseIcon} width={75} alt="Mobile App" />
            <Typography variant="body1" paragraph>
              Your reports are consolidated by the City and entered into
              a central database. All requests are assigned to the
              appropriate department to resolve.
            </Typography>
          </Grid>
          <Grid item sm={12} md={2}>
            <img className={classes.imageStyle} src={publishIcon} width={75} alt="Mobile App" />
            <Typography variant="body1" paragraph>
              Once data from each department is sorted,  the City then
              publishes it as raw information.
            </Typography>
          </Grid>
          <Grid item sm={12} md={2}>
            <img className={classes.imageStyle} src={visualizeIcon} width={75} alt="Mobile App" />
            <Typography variant="body1" paragraph>
              Our site draws data from the City’s database to create
              easy-to-view visualizations and files to export.
            </Typography>
          </Grid>
          <Grid item sm={12} md={2}>
            <img className={classes.imageStyle} src={upliftIcon} width={75} alt="Mobile App" />
            <Typography variant="body1" paragraph>
              You now have access to digestable data. Communities
              are empowered and equipped to identify areas of improvement to uplift and thrive.
            </Typography>
          </Grid>
        </Grid>
      </ContentBody>
    </>
  );
};

export default About;
