import React, { useEffect } from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { ThemeProvider, makeStyles, useTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { getMetadataRequest } from '@reducers/metadata';
import Header from '@components/Header';
import Footer from '@components/Footer';
import MapContainer from '@components/Map';
import theme from './theme/theme';
import PersistentDrawerLeft from '@components/LeftDrawer';
import GearButton from '@components/GearButton';
import { toggleMenu as reduxToggleMenu } from '@reducers/ui';

// const useStyles = makeStyles((theme) => ({
//   contentShift: {
//     transition: theme.transitions.create('margin', {
//       easing: theme.transitions.easing.easeOut,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//     marginLeft: 0,
//   },
// })

const App = ({
  getMetadata,
  toggleMenu
}) => {
  useEffect(() => {
    getMetadata();
  });

  // const classes = useStyles();
  // const mapTheme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <PersistentDrawerLeft />
      <GearButton onClick={toggleMenu}/>
      <Map />
      <MapContainer />
      <Footer />
    </ThemeProvider>
  );
};

const mapDispatchToProps = dispatch => ({
  getMetadata: () => dispatch(getMetadataRequest()),
  toggleMenu: () => dispatch(reduxToggleMenu())
});

export default connect(null, mapDispatchToProps)(App);

App.propTypes = {
  getMetadata: PropTypes.func.isRequired,
};
