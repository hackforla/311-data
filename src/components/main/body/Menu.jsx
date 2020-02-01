import React, { useState } from 'react';
import Sidebar from 'react-sidebar';

// const buildDataUrl = () => {
//   return `https://data.lacity.org/resource/${dataResources[year]}.json?$select=location,zipcode,address,requesttype,status,ncname,streetname,housenumber&$where=date_extract_m(CreatedDate)+between+${startMonth}+and+${endMonth}+and+requesttype='${request}'`;
// };

const Menu = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <>
      <Sidebar
        open={isSidebarOpen}
        sidebar={(
          <div>
            THIS IS A TEST
            <button
              type="button"
              className="button is-primary"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              Show quickview
            </button>
          </div>
        )}
        styles={{ sidebar: { background: 'white' } }}
      />
    </>
  );
};

// const mapStateToProps = state => ({});

export default Menu;
