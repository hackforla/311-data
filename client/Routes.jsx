import React from 'react';
import {
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Desktop from '@components/main/Desktop';
import Reports from '@components/main/Reports';
import Privacy from '@components/main/Privacy';
import Faqs from '@components/main/Faqs';
import About from '@components/main/About';
import Blog from '@components/main/Blog';
import ContactForm from '@components/main/ContactForm';

export default function Routes() {
  const { pathname } = useLocation();

  return (
    <>
      <Box visibility={pathname !== '/map' ? 'hidden' : 'visible'}>
        <Desktop />
      </Box>
      <Switch>
        <Route path="/reports" component={Reports} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/faqs" component={Faqs} />
        <Route path="/about" component={About} />
        <Route path="/blog" component={Blog} />
        <Route path="/contact" component={ContactForm} />
        <Route path="/">
          <Redirect to="map" />
        </Route>
      </Switch>
    </>
  );
}
