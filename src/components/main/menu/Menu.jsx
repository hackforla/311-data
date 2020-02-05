import React, { useState } from 'react';
import { slide as Sidebar } from 'react-burger-menu';
import Button from '../../common/Button';

// const buildDataUrl = () => {
//   return `https://data.lacity.org/resource/${dataResources[year]}.json?$select=location,zipcode,address,requesttype,status,ncname,streetname,housenumber&$where=date_extract_m(CreatedDate)+between+${startMonth}+and+${endMonth}+and+requesttype='${request}'`;
// };

const Menu = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Map');
  const sidebarWidth = '509px';

  const tabs = [
    'Map',
    'Data Visualization',
  ];

  const handleActiveTab = (tab) => (tab === activeTab ? 'is-active' : '');
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

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
              {tabs.map((tab) => (
                <li
                  key={tab}
                  className={handleActiveTab(tab)}
                  style={{ width: '254px' }}
                >
                  <a onClick={() => { handleTabClick(tab); }}>
                    {tab}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

// const mapStateToProps = state => ({});

export default Menu;
