import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Desktop from '@components/main/Desktop';
import Reports from '@components/main/Reports';

export default function Routes() {
  return (
    <Switch>
      <Route path="/map" component={Desktop} />
      <Route path="/reports" component={Reports} />
      <Route path="/">
        <Redirect to="map" />
      </Route>
    </Switch>
  );
}
