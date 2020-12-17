import React, { useEffect } from 'react';
import PropTypes from 'proptypes';
import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getMetadataRequest } from '@reducers/metadata';
import Routes from './Routes';
import Header from '@components/Header';
import Footer from '@components/Footer';

const App = ({
  getMetadata,
}) => {
  useEffect(() => {
    getMetadata();
  });

  return (
    <BrowserRouter>
      <Header />
      <Routes />
      <Footer />
    </BrowserRouter>
  );
};

const mapDispatchToProps = dispatch => ({
  getMetadata: () => dispatch(getMetadataRequest()),
});

export default connect(null, mapDispatchToProps)(App);

App.propTypes = {
  getMetadata: PropTypes.func.isRequired,
};
