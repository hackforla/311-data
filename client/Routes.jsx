import React from 'react';
import {
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import theme, { darkTheme } from '@theme/theme';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Desktop from '@components/main/Desktop';
import Dashboard from '@components/main/Dashboard';
import Privacy from '@components/main/Privacy';
import Faqs from '@components/main/Faqs';
import About from '@components/main/About';
import Research from '@components/main/Research';
import Contact from '@components/contact/Contact';
import ContentBottom from '@components/common/ContentBottom';
import queryString from 'query-string';

export default function Routes() {
  const { pathname, search } = useLocation();
  const values = queryString.parse(search);

  return (
    <>
      {/* Dark Theme - Map. */}
      <ThemeProvider theme={darkTheme}>
        <Paper elevation={0}>
          <Box visibility={pathname !== '/map' ? 'hidden' : 'visible'}>
            <Desktop
              initialState={values}
            />
          </Box>
        </Paper>
      </ThemeProvider>

      {/* Default theme - Everything else. */}
      <ThemeProvider theme={theme}>
        <Paper elevation={0}>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/faqs" component={Faqs} />
            <Route path="/research" component={Research} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/">
              <Redirect to={`map${search}`} />
            </Route>
          </Switch>
          <ContentBottom />
        </Paper>
      </ThemeProvider>
    </>
  );
}
