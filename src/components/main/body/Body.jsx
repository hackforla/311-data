import React from 'react';

import Menu from '../menu/Menu';
import PinMap from '../../PinMap/PinMap';
import Visualizations from '@components/Visualizations';

const Body = () => (
  <div id="body-container" className="body is-relative">
    <Menu />
    <PinMap />
    <Visualizations />
  </div>
);

export default Body;
