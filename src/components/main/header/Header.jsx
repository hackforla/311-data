import React from 'react';
import NCFilter from './NCFilter';
import DataPicker from './dataPicker';
// import Dropdown from '../../common/Dropdown';

const Header = ({
  updateState,
  toggleShowMarkers,
  showMarkers,
  showMarkersDropdown,
}) => (
  <section className="hero">
    <div className="hero-body">
      <div className="container">
        <h1 className="title">
          311 Data
        </h1>
        <h2 className="subtitle">
          Dashboard for NC
        </h2>
        <div className="columns">
          {/* <div className="column">
            <Dropdown />
          </div> */}
          <div className="column">
            <NCFilter />
          </div>
          <div className="column">
            <DataPicker
              showMarkerDropdown={showMarkersDropdown}
              showMarkers={showMarkers}
              onDropdownSelect={updateState}
              toggleShowMarkers={toggleShowMarkers}
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Header;
