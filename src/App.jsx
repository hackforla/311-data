import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './Routes';
import Header from './components/main/header/Header';
import Footer from './components/main/footer/Footer';
import Tooltip from './components/main/tooltip/Tooltip';
import SnapshotService, { SnapshotRenderer } from './components/export/SnapshotService';
import Visualizations from './components/Visualizations';

SnapshotService.register({ Visualizations });

const App = () => {
  useEffect(() => {
    // fetch data on load??
  }, []);

  return (
    <Router>
      <Header />
      <Routes />
      <Footer />
      <Tooltip />
      <SnapshotRenderer />
    </Router>
  );
};

export default connect(null, null)(App);
