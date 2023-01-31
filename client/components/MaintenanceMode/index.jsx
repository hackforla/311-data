import React from 'react';

const MaintenanceMode = () => (
  <div className="maintenance" role="banner">
    <div className="maintenance-overlay-text">
      <span className="text-311">311</span>
      <span className="text-data">DATA</span>
      <div className="maintenance-text">
        <div>
          <span>
            311-Data.com is temporarily unavailable while we prepare for our new version.
            Please check back again for our improved analytics tools. Thank you!
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default MaintenanceMode;
