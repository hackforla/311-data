import React, { useState } from 'react';
import { slide as Sidebar } from 'react-burger-menu';
import Button from '../../common/Button';

// const buildDataUrl = () => {
//   return `https://data.lacity.org/resource/${dataResources[year]}.json?$select=location,zipcode,address,requesttype,status,ncname,streetname,housenumber&$where=date_extract_m(CreatedDate)+between+${startMonth}+and+${endMonth}+and+requesttype='${request}'`;
// };

const Menu = () => {
  const [isOpen, setIsOpen] = useState(true);
  const sidebarWidth = '500px';

  return (
    <div>
      <Sidebar
        htmlClassName="sidebar-html"
        bodyClassName="sidebar-body"
        pageWrapId="sidebar-wrapper"
        outerContainerId="body-container"
        noOverlay
        isOpen={isOpen}
        width={sidebarWidth}
        customBurgerIcon={false}
        customCrossIcon={false}
        styles={{
          bmMenu: {
            background: 'white',
            boxShadow: '0 4px 5px grey',
          },
        }}
      >
        <div id="sidebar-wrapper">
          <Button
            id="menu-toggle-button"
            label="<"
            style={{
              position: 'fixed',
              left: sidebarWidth,
              height: '60px',
              width: '26px',
              boxShadow: '0 1px 2px grey',
            }}
            handleClick={() => setIsOpen(!isOpen)}
            color="light"
          />
          <div
            className="tabs is-fullwidth is-toggle"
            style={{
              height: '40px',
            }}
          >
            <ul>
              <li className="is-active" style={{ background: 'yellow', width: '254px' }}>
                <a>Map</a>
              </li>
              <li style={{ width: '254px' }}>
                <a>Data Visualization</a>
              </li>
            </ul>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

// const mapStateToProps = state => ({});

export default Menu;
