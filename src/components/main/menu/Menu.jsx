/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import clx from 'classnames';
import { Switch, Route } from 'react-router-dom';

import {
  toggleMenu as reduxToggleMenu,
  setMenuTab as reduxSetMenuTab,
} from '@reducers/ui';

import { MENU_TABS } from '@components/common/CONSTANTS';
import Button from '@components/common/Button';
import InfoTitle from '@components/common/InfoTitle';
import Submit from './Submit';
import DateSelector from './DateSelector/DateSelector';
import NCSelector from './NCSelector';
import RequestTypeSelector from './RequestTypeSelector';
import DistrictSelector from './DistrictSelector/DistrictSelector';
import ChartSelector from './ChartSelector';

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
    <div className="menu-container">
      <Switch>
        <Route exact path="/data">
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
        </Route>
      </Switch>

      <Button
        id="menu-toggle-button"
        icon={!isOpen ? 'chevron-right' : 'chevron-left'}
        iconStyle={{ margin: '0px' }}
        handleClick={() => toggleMenu()}
        color="light"
      />

      <Switch>
        <Route path="/comparison">
          <div className="menu-content">
            <h1>Comparison Filters</h1>
            <DateSelector comparison key="comparison-dateselector" />
            <DistrictSelector />
            <ChartSelector />
            <RequestTypeSelector comparison />
            <Submit />
          </div>
        </Route>
        <Route path="/data">
          <div className="menu-content with-tabs">
            <h1>Filters</h1>
            <DateSelector key="data-dateselector" />
            <InfoTitle
              title="Neighborhood Council (NC) Selection"
              element="h2"
              infoText="This filter allows the user to select specific neighborhood councils."
            />
            <NCSelector />
            <RequestTypeSelector />
            <Submit />
          </div>
        </Route>
      </Switch>
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
