import React, { useEffect } from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';

import { getMetadataRequest } from '@reducers/metadata';

import Routes from './Routes';
import Header from './components/main/header/Header';
import Footer from './components/main/footer/Footer';
import { SnapshotRenderer } from './components/export/SnapshotService';

const basename = process.env.NODE_ENV === 'development' ? '/' : process.env.BASE_URL || '/';

const App = ({
  getMetadata,
}) => {
  useEffect(() => {
    getMetadata();
  });

  return (
    <Router basename={basename}>
      <Header />
      <Routes />
      <Footer />
      <SnapshotRenderer />
    </Router>
  );
};

const mapDispatchToProps = dispatch => ({
  getMetadata: () => dispatch(getMetadataRequest()),
});

export default connect(null, mapDispatchToProps)(App);

App.propTypes = {
  getMetadata: PropTypes.func.isRequired,
};
