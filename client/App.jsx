import React, { useEffect } from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { ThemeProvider, makeStyles, useTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { getMetadataRequest } from '@reducers/metadata';
import Header from '@components/Header';
import Footer from '@components/Footer';
import Map from '@components/Map';
import theme from './theme/theme';
import PersistentDrawerLeft from '@components/LeftDrawer';
import GearButton from '@components/GearButton';
import { toggleMenu as reduxToggleMenu } from '@reducers/ui';
import { useSwipeable } from "react-swipeable";

const App = ({
  getMetadata,
  toggleMenu
}) => {
  useEffect(() => {
    getMetadata();
  });

  const handleSwipeMenu = useSwipeable({
    trackMouse: true,
    onSwipedRight: () => toggleMenu(),
    onSwipedLeft: () => toggleMenu()
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <PersistentDrawerLeft />
      <GearButton onClick={toggleMenu}/>
      <div {...handleSwipeMenu}>
        <Map />
      </div>
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
