import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import theme from '@theme/theme';
import store from '@root/redux/store';
import App from '@root/App';
import DbProvider from '@db/DbProvider';

// Expose theme to debugging console like on mui.com.
// https://v4.mui.com/customization/typography/#default-values
window.theme = theme;

ReactDOM.render(
  <Provider store={store}>
    <DbProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </DbProvider>
  </Provider>,
  document.getElementById('root'),
);

// hot module replacement during development
if (module.hot) module.hot.accept();
