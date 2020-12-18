import React, { useEffect } from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { ThemeProvider, makeStyles, useTheme } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { getMetadataRequest } from '@reducers/metadata';
import Header from '@components/Header';
import Footer from '@components/Footer';
import MapContainer from '@components/Map';
import PersistentDrawerLeft from '@components/LeftDrawer';
import GearButton from '@components/GearButton';
import { toggleMenu as reduxToggleMenu } from '@reducers/ui';
import { useSwipeable } from 'react-swipeable';
import theme from './theme/theme';

const menuStyles = {
  swipeAreaOpen: {
    float: 'left',
    position: 'fixed',
    width: '30%',
    height: '100%',
  },
  gear: {
    marginLeft: '85vw',
    marginTop: '70vh',
  },
};

const App = ({
  getMetadata,
  toggleMenu,
}) => {
  useEffect(() => {
    getMetadata();
  });

  const handleSwipeMenu = useSwipeable({
    trackMouse: true,
    onSwipedRight: () => toggleMenu(),
    onSwipedLeft: () => toggleMenu(),
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <PersistentDrawerLeft />
      <MapContainer />
      {/* area where you can swipe the menu sidebar */}
      <div {...handleSwipeMenu} style={menuStyles.swipeAreaOpen} />
      <GearButton onClick={toggleMenu} style={menuStyles.gear} />
      <Footer />
    </ThemeProvider>
  );
};

const mapDispatchToProps = dispatch => ({
  getMetadata: () => dispatch(getMetadataRequest()),
  toggleMenu: () => dispatch(reduxToggleMenu()),
});

export default connect(null, mapDispatchToProps)(App);

App.propTypes = {
  getMetadata: PropTypes.func.isRequired,
};
