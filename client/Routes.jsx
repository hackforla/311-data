import React from 'react';
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Desktop from '@components/main/Desktop';

export default function Routes() {
  return (
    <Switch>
      <Route path="/map" component={Desktop} />
      <Route path="/">
        <Redirect to="map" />
      </Route>
    </Switch>
  );
}
