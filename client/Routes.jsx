import React from 'react';
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Desktop from '@components/main/Desktop';

import ClientsidePlotly from '@components/Plotly/ClientsidePlotly';
import ServersidePlotly from '@components/Plotly/ServersidePlotly';

export default function Routes() {
  return (
    <Switch>
      <Route path="/map" component={Desktop} />
      <Route
        path="/plotly-clientside"
        component={ClientsidePlotly}
      />
      <Route
        path="/plotly-serverside"
        component={ServersidePlotly}
      />
      <Route path="/">
        <Redirect to="map" />
      </Route>
    </Switch>
  );
}
