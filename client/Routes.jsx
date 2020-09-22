import React from 'react';
import {
  Switch,
  Route,
} from 'react-router-dom';

import PrivacyPolicy from '@components/privacyPolicy/PrivacyPolicy';
import Contact from './components/contact/Contact';
import About from './components/about/About';
import Body from './components/main/body/Body';
import Faq from './components/faq/Faq';

export default function Routes() {
  return (
    <Switch>
      <Route path="/contact" component={Contact} />
      <Route path="/about" component={About} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/comparison" component={Body} />
      <Route path="/faq" component={Faq} />
      <Route path="/data" component={Body} />
      <Route path="/" component={About} />
    </Switch>
  );
}
