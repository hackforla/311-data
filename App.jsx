import React, { useEffect } from 'react';
import PropTypes from 'proptypes';
import { HashRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getMetadataRequest } from '@reducers/metadata';

import Header from '@components/Header';
import Footer from '@components/Footer';
import AppRoutes from './Routes';

function App({ getMetadata }) {
  useEffect(() => {
    getMetadata();
  });

  return (
    <HashRouter>
      <Header />
      <AppRoutes />
      <Footer />
    </HashRouter>
  );
}

const mapDispatchToProps = dispatch => ({
  getMetadata: () => dispatch(getMetadataRequest()),
});

export default connect(null, mapDispatchToProps)(App);

App.propTypes = {
  getMetadata: PropTypes.func.isRequired,
};
