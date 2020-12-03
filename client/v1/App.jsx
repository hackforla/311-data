import React, { useEffect } from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'focus-visible';
import { getMetadataRequest } from '@reducers/metadata';

import RouteChange from '@components/main/util/RouteChange';
import actions from '@components/main/util/routeChangeActions';
import CookieNotice from '@components/main/body/CookieNotice';
import Header from '@components/main/header/Header';
import Footer from '@components/main/footer/Footer';
import StaticFooter from '@components/main/footer/StaticFooter';
import { SnapshotRenderer } from '@components/export/SnapshotService';
import Routes from './Routes';

const App = ({
  getMetadata,
}) => {
  useEffect(() => {
    getMetadata();
  });

  return (
    <Router>
      <RouteChange actions={actions} />
      <Header />
      <Routes />
      <Switch>
        <Route path="/(about|contact|privacy|faq)" component={StaticFooter} />
        <Route path="/" component={Footer} />
      </Switch>
      <SnapshotRenderer />
      <CookieNotice />
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
