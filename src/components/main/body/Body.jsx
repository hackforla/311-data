import React from 'react';
import PinMap from '../../PinMap/PinMap';
import Legend from '../header/Legend';

const Body = ({
  showMarkers,
  data,
  updateState,
  toggleShowMarkers,
}) => (
  <div className="container is-fluid">
    <div className="columns">
      <div className="column is-2">
        <Legend />
      </div>
      <div className="column">
        <PinMap
          showMarkers={showMarkers}
          data={data}
          onDropdownSelect={updateState}
          toggleShowMarker={toggleShowMarkers}
        />
      </div>
    </div>
  </div>
);

export default Body;
