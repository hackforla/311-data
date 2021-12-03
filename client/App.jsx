import React, { useEffect } from 'react';
import PropTypes from 'proptypes';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getMetadataRequest } from '@reducers/metadata';
import { toggleMenu as reduxToggleMenu } from '@reducers/ui';
// import { useSwipeable } from 'react-swipeable';
import Legend from '@components/common/Legend';
import Header from '@components/Header';
import Footer from '@components/Footer';
import Routes from './Routes';

// const menuStyles = {
//   swipeAreaOpen: {
//     float: 'left',
//     position: 'fixed',
//     width: 150,
//     height: '100%',
//   },
// };

const App = ({
  getMetadata,
  // toggleMenu,
}) => {
  useEffect(() => {
    getMetadata();
  });

  // const handleSwipeMenu = useSwipeable({
  //   trackMouse: true,
  //   onSwipedRight: () => toggleMenu(),
  //   onSwipedLeft: () => toggleMenu(),
  // });

  return (
    <BrowserRouter>
      <Header />
      <Legend />
      <Routes />
      {/* area where you can swipe the menu sidebar */}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      {/* <div {...handleSwipeMenu} style={menuStyles.swipeAreaOpen} /> */}
      <Footer />
    </BrowserRouter>
  );
};

const mapDispatchToProps = dispatch => ({
  getMetadata: () => dispatch(getMetadataRequest()),
  toggleMenu: () => dispatch(reduxToggleMenu()),
});

export default connect(null, mapDispatchToProps)(App);

App.propTypes = {
  getMetadata: PropTypes.func.isRequired,
  // toggleMenu: PropTypes.func.isRequired,
};
