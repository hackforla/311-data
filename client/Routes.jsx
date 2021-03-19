import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Desktop from '@components/main/Desktop';
import Reports from '@components/main/Reports';
import Privacy from '@components/main/Privacy';
import Faqs from '@components/main/Faqs';
import Blog from '@components/main/Blog';
import ContactForm from '@components/main/ContactForm';

export default function Routes() {
  return (
    <Switch>
      <Route path="/map" component={Desktop} />
      <Route path="/reports" component={Reports} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/faqs" component={Faqs} />
      <Route path="/blog" component={Blog} />
      <Route path="/contact" component={ContactForm} />
      <Route path="/">
        <Redirect to="map" />
      </Route>
    </Switch>
  );
}
