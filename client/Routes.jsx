import React from 'react';
import {
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Desktop from '@components/main/Desktop';


import PlotlyClient from '@components/Plotly/PlotlyClient';
import PlotlyServer from '@components/Plotly/PlotlyServer';

export default function Routes() {
  return (
    <Switch>
      <Route path="/map" component={Desktop} />
      <Route
        path="/plotly-clientside"
        component={PlotlyClient}
      />
      <Route
        path="/plotly-serverside"
        component={PlotlyServer}
      />
      <Route path="/">
        <Redirect to="map" />
      </Route>
    </Switch>
  );
}
