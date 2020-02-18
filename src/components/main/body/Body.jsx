import React from 'react';

import Menu from '../menu/Menu';
import PinMap from '../../PinMap/PinMap';

const Body = () => (
  <div id="body-container" className="body">
    <Menu />
    <main id="body-wrap">
      <PinMap />
    </main>
  </div>
);

export default Body;
