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
import Reports from '@components/main/Reports';
import Privacy from '@components/main/Privacy';
import Faqs from '@components/main/Faqs';
import About from '@components/main/About';
import Contact from '@components/contact/Contact';
import ContentBottom from '@components/common/ContentBottom';

export default function Routes() {
  const { pathname } = useLocation();

  return (
    <>
      {/* Dark Theme - Map. */}
      <ThemeProvider theme={darkTheme}>
        <Paper elevation={0}>
          <Box visibility={pathname !== '/map' ? 'hidden' : 'visible'}>
            <Desktop />
          </Box>
        </Paper>
      </ThemeProvider>

      {/* Default theme - Everything else. */}
      <ThemeProvider theme={theme}>
        <Paper elevation={0}>
          <Switch>
            <Route path="/reports" component={Reports} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/faqs" component={Faqs} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/">
              <Redirect to="map" />
            </Route>
          </Switch>
          <ContentBottom />
        </Paper>
      </ThemeProvider>
    </>
  );
}
