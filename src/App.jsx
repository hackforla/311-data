import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Header from './components/main/header/Header';
import Body from './components/main/body/Body';
import Footer from './components/main/footer/Footer';
import Tooltip from './components/main/tooltip/Tooltip';

const App = () => {
  useEffect(() => {
    // fetch data on load??
  }, []);

  return (
    <>
      <Header />
      <Body />
      <Footer />
      <Tooltip />
    </>
  );
};

export default connect(null, null)(App);
