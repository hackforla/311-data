import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Header from './components/main/header/Header';
import Body from './components/main/body/Body';
import Footer from './components/main/footer/Footer';

const App = () => {
  useEffect(() => {
    // fetch data on load??
  }, []);

  return (
    <div className="main">
      <Header />
      <Body />
      <Footer />
    </div>
  );
};

export default connect(null, null)(App);
