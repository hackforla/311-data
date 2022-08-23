import React from 'react';
import {
  makeStyles,
  Container,
  Grid,
} from '@material-ui/core';
import empowerLaLogo from '@assets/empower_la_logo.png';
import hackForLaLogo from '@assets/hack_for_la_logo.png';
import codeForAmericaLogo from '@assets/code_for_america_logo.png';

const useStyles = makeStyles({
  root: {
    color: 'black',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2em',
    '& h1': {
      fontSize: '2.5em',
    },
    '& h2': {
      fontSize: '2.25em',
    },
    '& img': {
      maxWidth: '100%',
      height: 'auto',
      display: 'inline-block',
    },
  },
  gridItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '4em',
    paddingBottom: '6em',
  },
});

const About = () => {
  const classes = useStyles();

  return (
    <>
      <Container disableGutters component="main" className={classes.root} maxWidth="md">
        <Grid container>
          <Grid item xs={12}>
            <h1 align="center">
              About
              <span style={{ color: '#FFB100' }}> 311</span>
              <span style={{ color: '#87C8BC' }}>DATA</span>
            </h1>
            <p>
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
              this project comes in.
            </p>
            <h2 style={{ color: '#1D6996', textAlign: 'center' }}>Partners</h2>
            <p>
              To empower local residents and Neighborhood Councils to
              make informed decisions about how to improve their communities
              using an easy-to-use application, EmpowerLA partnered with Hack
              For LA  to create the 311 Data project. The 311 Data project makes
              navigating the wealth of 311 data easier using an open source
              application built and maintained by volunteers throughout our community.
            </p>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item sm={12} md={4} className={classes.gridItem}>
            <img src={empowerLaLogo} width={362} alt="Empower LA" />
          </Grid>
          <Grid item sm={12} md={4} className={classes.gridItem}>
            <img src={hackForLaLogo} width={97} alt="Hack for LA" />
          </Grid>
          <Grid item sm={12} md={4} className={classes.gridItem}>
            <img src={codeForAmericaLogo} width={202} alt="Code for America" />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default About;
