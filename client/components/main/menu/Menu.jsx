/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';

import {
  toggleMenu as reduxToggleMenu,
  setMenuTab as reduxSetMenuTab,
  setMenuMode as reduxSetMenuMode,
  toggleComparing as reduxToggleComparing,
} from '@reducers/ui';

import Button from '@components/common/Button';
import InfoTitle from '@components/common/InfoTitle';
import HoverOverInfo from '@components/common/HoverOverInfo';
import Submit from './Submit';
import DateSelector from './DateSelector/DateSelector';
import NCSelector from './NCSelector';
import RequestTypeSelector from './RequestTypeSelector';
import DistrictSelector from './DistrictSelector/DistrictSelector';
import ChartSelector from './ChartSelector';
import ToggleSwitch from '../../common/ToggleSwitch';

const Menu = ({
  isOpen,
  toggleMenu,
  toggleComparing,
  isComparing,
}) => {
  let menuContent;
  if (isComparing) {
    menuContent = (
      <>
        <InfoTitle
          title="Date Range Selection"
          element="h2"
          infoText={[
            'This filter allows the user to choose a date range for 311 comparison data.',
            '* Please click to make a selection.',
          ]}
        />
        <DateSelector comparison key="comparison-dateselector" />
        <InfoTitle
          title="District Selection"
          element="h2"
          infoText={[
            'This filter allows the user to select specific district boundaries for comparison.',
            '* Please click to select districts for comparison.',
          ]}
        />
        <DistrictSelector />
        <InfoTitle
          title="Chart Selection"
          element="h2"
          infoText={[
            'This filter allows the user to select a chart for comparison.',
            '* Please click on a chart type to make a selection.',
          ]}
        />
        <ChartSelector />
        <InfoTitle
          title="Request Type Selection"
          element="h2"
          infoText={[
            'This filter allows the user to select specific 311 request types for comparison.',
            '* Please check box to make one or more selections.',
          ]}
        />
        <RequestTypeSelector comparison />
        <Submit />
      </>
    );
  } else {
    menuContent = (
      <>
        <InfoTitle
          title="Date Range Selection"
          element="h2"
          infoText={[
            'This filter allows the user to choose a date range for 311 data.',
            '* Please click to make a selection.',
          ]}
        />
        <DateSelector key="data-dateselector" />
        <InfoTitle
          title="NC/CC Selection"
          element="h2"
          infoText={[
            'This filter allows the user to select specific neighborhood councils.',
            '* Please check box to make one or more selections.',
          ]}
          position="top"
        />
        <NCSelector />
        <InfoTitle
          title="Request Type Selection"
          element="h2"
          infoText={[
            'This filter allows the user to select specific 311 request types.',
            '* Please check box to make one or more selections.',
          ]}
        />
        <RequestTypeSelector />
      </>
    );
  }

  return (
    <div className="menu-container">
      <div className="menu-toggle-button-container">
        <HoverOverInfo
          text="Click to show/hide the filters"
          position="right"
        >
          <Button
            id="menu-toggle-button"
            icon={!isOpen ? 'chevron-right' : 'chevron-left'}
            iconStyle={{ margin: '0px' }}
            handleClick={() => toggleMenu()}
            color="light"
          />
        </HoverOverInfo>
      </div>

      <div className="menu-content">
        <InfoTitle
          title="Compare Different Councils"
          element="h2"
          infoText={[
            'This toggle switch allows the user to choose whether to compare data from different councils.',
            '* Please click to toggle.',
          ]}
          position="bottom"
        />
        <ToggleSwitch
          id="compare-councils-toggle-switch"
          handleClick={() => toggleComparing()}
        />
        {menuContent}
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  isOpen: state.ui.menu.isOpen,
  activeTab: state.ui.menu.activeTab,
  activeMode: state.ui.menu.activeMode,
  isComparing: state.ui.menu.isComparing,
});

const mapDispatchToProps = dispatch => ({
  toggleMenu: () => dispatch(reduxToggleMenu()),
  setMenuTab: tab => dispatch(reduxSetMenuTab(tab)),
  setMenuMode: mode => dispatch(reduxSetMenuMode(mode)),
  toggleComparing: () => dispatch(reduxToggleComparing()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);

Menu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  activeTab: PropTypes.string.isRequired,
  activeMode: PropTypes.string.isRequired,
  toggleMenu: PropTypes.func,
  setMenuTab: PropTypes.func,
  setMenuMode: PropTypes.func,
  toggleComparing: PropTypes.func,
  isComparing: PropTypes.bool.isRequired,
};

Menu.defaultProps = {
  toggleMenu: () => null,
  setMenuTab: () => null,
  setMenuMode: PropTypes.func,
  toggleComparing: () => null,
  isComparing: false,
};
