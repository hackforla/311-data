import React, { useEffect } from 'react';
import PropTypes from 'proptypes';
import { HashRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { getMetadataRequest } from '@reducers/metadata';

import Header from '@components/Header';
import Footer from '@components/Footer';
import AppRoutes from './Routes';

const TITLE = '311-Data Neighborhood Engagement Tool';
const DESCRIPTION =
  'Hack for LA’s 311-Data Team has partnered with the Los Angeles Department of Neighborhood Empowerment and LA Neighborhood Councils to create 311 data dashboards to provide all City of LA neighborhoods with actionable information at the local level.';
const URL = 'https://www.311-data.org/';
const SOCIAL_IMAGE = '/social-media-card-image.png';

function App({ getMetadata }) {
  useEffect(() => {
    getMetadata();
  });

  return (
    <HashRouter>
      <Helmet>
        <title>{TITLE}</title>
        <link rel="icon" href="/favicon.png" />
        <meta name="description" content={DESCRIPTION} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={URL} />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:image" content={SOCIAL_IMAGE} />
        <meta name="twitter:description" content={DESCRIPTION} />

        <meta name="og:type" content="website" />
        <meta name="og:url" content={URL} />
        <meta name="og:title" content={TITLE} />
        <meta name="og:image" content={SOCIAL_IMAGE} />
        <meta name="og:description" content={DESCRIPTION} />
      </Helmet>

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
