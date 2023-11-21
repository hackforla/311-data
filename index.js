import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import DbProvider from '@db/DbProvider';
import theme from '@theme/theme';
import store from '@root/redux/store';
import App from '@root/App';

// Expose theme to debugging console like on mui.com.
// https://mui.com/material-ui/customization/typography/#default-values
window.theme = theme;

ReactDOM.render(
  <Provider store={store}>
    <DbProvider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </StyledEngineProvider>
    </DbProvider>
  </Provider>,
  document.getElementById('root'),
);

// hot module replacement during development
if (module.hot) module.hot.accept();
