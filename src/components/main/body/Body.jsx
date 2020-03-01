import React from 'react';

import Visualizations from '@components/Visualizations';
import Menu from '../menu/Menu';
import PinMap from '../../PinMap/PinMap';

const Body = () => (
  <div id="body-container" className="body is-relative">
    <Menu />
    <main id="body-wrap">
      <PinMap />
      <Visualizations />
    </main>
  </div>
);

export default Body;
