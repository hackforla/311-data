import React from 'react';
import PinMap from '../../PinMap/PinMap';

const Body = ({
  showMarkers,
  data,
  updateState,
  toggleShowMarkers,
}) => (
  <div className="container is-fluid">
    <div className="columns">
      <PinMap
        showMarkers={showMarkers}
        data={data}
        onDropdownSelect={updateState}
        toggleShowMarker={toggleShowMarkers}
      />
    </div>
  </div>
);

export default Body;
