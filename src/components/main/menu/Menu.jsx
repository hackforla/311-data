/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import clx from 'classnames';

import {
  toggleMenu as reduxToggleMenu,
  setMenuTab as reduxSetMenuTab,
} from '@reducers/ui';

import { MENU_TABS } from '@components/common/CONSTANTS';
import Button from '@components/common/Button';
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
  const tabs = [
    MENU_TABS.MAP,
    MENU_TABS.VISUALIZATIONS,
  ];

  return (
    <div className={clx('menu-container', { open: isOpen })}>
      <div className="menu-tabs">
        {tabs.map(tab => (
          <a
            key={tab}
            className={clx('menu-tab', { active: tab === activeTab })}
            onClick={tab === activeTab ? undefined : () => setMenuTab(tab)}
          >
            { tab }
          </a>
        ))}
      </div>

      <Button
        id="menu-toggle-button"
        icon={!isOpen ? 'chevron-right' : 'chevron-left'}
        iconStyle={{ margin: '0px' }}
        handleClick={() => toggleMenu()}
        color="light"
      />

      <div className="menu-content">
        <h1>Filters</h1>
        <DateSelector />
        <NCSelector />
        <RequestTypeSelector />
        <Submit />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isOpen: state.ui.menu.isOpen,
  activeTab: state.ui.menu.activeTab,
});

const mapDispatchToProps = dispatch => ({
  toggleMenu: () => dispatch(reduxToggleMenu()),
  setMenuTab: tab => dispatch(reduxSetMenuTab(tab)),
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
