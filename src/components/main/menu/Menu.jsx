import React, { useState } from 'react';
import { slide as Sidebar } from 'react-burger-menu';

import Button from '../../common/Button';
import NCSelector from './NCSelector';

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
        noOverlay
        disableAutoFocus
        pageWrapId="sidebar-wrapper"
        outerContainerId="body-container"
        isOpen={isOpen}
        width={sidebarWidth}
        customBurgerIcon={false}
        customCrossIcon={false}
        styles={{
          bmMenu: {
            background: 'white',
            boxShadow: '0px 4px 5px rgba(108, 108, 108, 0.3)',
          },
        }}
      >
        <div
          id="sidebar-wrapper"
          className="sidebar-content"
        >

          {/* Tabs */}
          <div
            className="tabs is-fullwidth is-toggle"
            style={{
              height: '40px',
              margin: '0',
            }}
          >
            <ul>
              {tabs.map((tab) => (
                <li
                  key={tab}
                  className={handleActiveTab(tab)}
                  style={{ width: '254px' }}
                >
                  <button
                    type="button"
                    onClick={() => { handleTabClick(tab); }}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Open/Close Button */}
          <Button
            id="menu-toggle-button"
            label="<"
            style={{
              position: 'fixed',
              left: sidebarWidth,
              height: '60px',
              width: '26px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
              borderRadius: '0',
            }}
            handleClick={() => setIsOpen(!isOpen)}
            color="light"
          />

          {/* Content */}
          <div className="sidebar-content" style={{ padding: '16px' }}>
            <div className="sidebar-title">
              <p className="subtitle">
                <strong>
                  Filters
                </strong>
              </p>
            </div>
            <NCSelector />
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

// const mapStateToProps = state => ({});

export default Menu;
