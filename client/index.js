/* eslint-disable react/jsx-filename-extension */

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import store from './redux/store';
import App from './App';
import theme from './theme/theme';


Sentry.init({
  dsn: "https://7e1f75ca9a3d4de797f3f6cb95478ac9@o452210.ingest.sentry.io/5672572",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </Provider>,
  document.getElementById('root'),
);

// hot module replacement during development
if (module.hot) module.hot.accept();
