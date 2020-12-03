import React, { useEffect } from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { getMetadataRequest } from '@reducers/metadata';
import Header from '@components/Header';
import Footer from '@components/Footer';
import Map from '@components/Map';
import theme from './theme/theme';

const App = ({
  getMetadata,
}) => {
  useEffect(() => {
    getMetadata();
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Map />
      <Footer />
    </ThemeProvider>
  );
};

const mapDispatchToProps = dispatch => ({
  getMetadata: () => dispatch(getMetadataRequest()),
});

export default connect(null, mapDispatchToProps)(App);

App.propTypes = {
  getMetadata: PropTypes.func.isRequired,
};
