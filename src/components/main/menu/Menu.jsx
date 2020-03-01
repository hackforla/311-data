/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { slide as Sidebar } from 'react-burger-menu';

import {
  toggleMenu as reduxToggleMenu,
  setMenuTab as reduxSetMenuTab,
} from '@reducers/ui';
import { MENU_TABS } from '@components/common/CONSTANTS';

import Button from '../../common/Button';
import Submit from './Submit';
import DateSelector from './DateSelector/DateSelector';
import NCSelector from './NCSelector';
import RequestTypeSelector from './RequestTypeSelector';

const Menu = ({
  isOpen,
  activeTab,
  toggleMenu,
  setMenuTab,
}) => {
  const sidebarWidth = '509px';

  const tabs = [
    MENU_TABS.MAP,
    MENU_TABS.VISUALIZATIONS,
  ];

  const handleActiveTab = (tab) => (tab === activeTab ? 'is-active' : '');

  return (
    <div>
      <Sidebar
        noOverlay
        disableAutoFocus
        pageWrapId="sidebar-wrapper"
        outerContainerId="body-container"
        isOpen={isOpen}
        width={sidebarWidth}
        customBurgerIcon={true}
        customCrossIcon={false}
        styles={{
          bmMenu: {
            background: 'white',
            boxShadow: '0px 4px 5px rgba(108, 108, 108, 0.3)'
          },
        }}
      >
        <div
          id="sidebar-wrapper"
          className="sidebar-content"
          // TODO: Fix this for better handling of height
          style={{
            height: '85vh',
            overflowY: 'scroll',
          }}
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
                  <a onClick={() => { setMenuTab(tab); }}>
                    {tab}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Open/Close Button */}
          <Button
            id="menu-toggle-button"
            icon={!isOpen ? 'chevron-right' : 'chevron-left'}
            iconStyle={{ margin: '0px' }}
            style={{
              position: 'fixed',
              left: sidebarWidth,
              height: '60px',
              width: '26px',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
              borderRadius: '0',
            }}
            handleClick={() => toggleMenu()}
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
            <DateSelector />
            <NCSelector />
            <RequestTypeSelector />
            <Submit />
          </div>
        </div>
      </Sidebar>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isOpen: state.ui.menu.isOpen,
  activeTab: state.ui.menu.activeTab,
});

const mapDispatchToProps = (dispatch) => ({
  toggleMenu: () => dispatch(reduxToggleMenu()),
  setMenuTab: (tab) => dispatch(reduxSetMenuTab(tab)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);

Menu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  activeTab: PropTypes.string.isRequired,
  toggleMenu: PropTypes.func,
  setMenuTab: PropTypes.func,
};

Menu.defaultProps = {
  toggleMenu: () => null,
  setMenuTab: () => null,
};
