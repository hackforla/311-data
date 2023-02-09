import React from 'react';

const MaintenanceMode = () => (
  <div className="maintenance" role="banner">
    <div className="maintenance-overlay-text">
      <span className="text-311">311</span>
      <span className="text-data">DATA</span>
      <div className="maintenance-text">
        <div>
          <span>
            Hack for LA&apos;s 311 data analysis is down temporarily while we rebuild.
            If you are looking to place a 311 ticket, please visit Los Angeles&apos;s 311 system:
            {' '}
          </span>
          <a href="https://myla311.lacity.org/">https://myla311.lacity.org/</a>
        </div>
      </div>
    </div>
  </div>
);

export default MaintenanceMode;
