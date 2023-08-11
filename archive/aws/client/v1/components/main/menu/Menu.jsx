/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useRef } from 'react';
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
import HoverOverInfo from '@components/common/HoverOverInfo';
import Icon from '@components/common/Icon';
import Submit from './Submit';
import ErrorMessage from './ErrorMessage';
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
  const ncRef = useRef(null);
  const requestsRef = useRef(null);
  const [dataErrors, setDataErrors] = useState({
    missingStartDate: false,
    missingEndDate: false,
    missingCouncils: false,
    missingRequestTypes: false,
  });

  const [comparisonErrors, setComparisonErrors] = useState({
    missingStartDate: false,
    missingEndDate: false,
    missingChart: false,
    missingDistrictOne: false,
    missingDistrictTwo: false,
    missingRequestTypes: false,
  });
  const setDErrors = (startDate, endDate, councils, requestTypes) => {
    setDataErrors({
      missingStartDate: startDate,
      missingEndDate: endDate,
      missingCouncils: councils,
      missingRequestTypes: requestTypes,
    });
  };
  const setCErrors = (startDate, endDate, chart, districtOne, districtTwo, requestTypes) => {
    setComparisonErrors({
      missingStartDate: startDate,
      missingEndDate: endDate,
      missingChart: chart,
      missingDistrictOne: districtOne,
      missingDistrictTwo: districtTwo,
      missingRequestTypes: requestTypes,
    });
  };

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
                onKeyUp={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setMenuTab(tab);
                  }
                }}
                tabIndex="0"
                role="button"
              >
                {tab}
              </a>
            ))}
          </div>
        </Route>
      </Switch>

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
            ariaLabel="show/hide filter menu"
          />
        </HoverOverInfo>
      </div>

      <Switch>
        <Route path="/comparison">
          <div className="menu-content">
            <h1>Comparison Filters</h1>
            <p>* Indicates to make at least one selection</p>

            <InfoTitle
              title="Date Range Selection *"
              element="h2"
              infoText={[
                'This filter allows the user to choose a date range for 311 comparison data.',
                '* Please click to make a selection.',
              ]}
            />
            {
              comparisonErrors.missingEndDate && <ErrorMessage errorType="data" />
            }
            <DateSelector comparison key="comparison-dateselector" />
            <InfoTitle
              title="District Selection *"
              element="h2"
              infoText={[
                'This filter allows the user to select specific district boundaries for comparison.',
                '* Please click to select districts for comparison.',
              ]}
            />
            {
              (comparisonErrors.missingDistrictOne || comparisonErrors.missingDistrictTwo)
              && <ErrorMessage errorType="districtset" />
            }
            <DistrictSelector />
            <InfoTitle
              title="Chart Selection *"
              element="h2"
              infoText={[
                'This filter allows the user to select a chart for comparison.',
                '* Please click on a chart type to make a selection.',
              ]}
            />
            {
              comparisonErrors.missingChart && <ErrorMessage errorType="selectone" />
            }
            <ChartSelector />
            <InfoTitle
              title="Request Type Selection *"
              element="h2"
              infoText={[
                'This filter allows the user to select specific 311 request types for comparison.',
                '* Please check box to make one or more selections.',
              ]}
            />
            {
              comparisonErrors.missingRequestTypes && <ErrorMessage errorType="selectone" />
            }
            <RequestTypeSelector comparison />
            <Submit setCErrors={setCErrors} setDErrors={setDErrors} />
          </div>
        </Route>
        <Route path="/data">
          <div className="menu-content with-tabs">
            <h1>Filters</h1>
            <p>* Indicates to make at least one selection</p>
            <InfoTitle
              title="Date Range Selection *"
              element="h2"
              infoText={[
                'This filter allows the user to choose a date range for 311 data.',
                '* Please click to make a selection.',
              ]}
            />
            <HoverOverInfo
              title="Skip to Neighborhood Councils"
              position="left"
              tabIndex={0}
              style={{
                position: 'absolute',
                right: '50px',
                top: '125px',
                padding: '10px 0 0 0',
              }}
              onKeyUp={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  ncRef.current.focus();
                }
              }}
            >
              <Icon
                id="nav-jump"
                icon="angle-double-down"
                size="small"
                ariaLabel="skip to neighborhood councils"
                handleClick={() => {
                  ncRef.current.focus();
                }}

              />
            </HoverOverInfo>
            {
              dataErrors.missingEndDate && <ErrorMessage errorType="data" />
            }
            <DateSelector key="data-dateselector" />
            <div className="flex" id="nc-selection-container" ref={ncRef} tabIndex={-1}>
              <InfoTitle
                title="Neighborhood Council (NC) Selection *"
                element="h2"
                infoText={[
                  'This filter allows the user to select specific neighborhood councils.',
                  '* Please check box to make one or more selections.',
                ]}
                position="top"
              />
              <HoverOverInfo
                title="Skip to Request Types"
                position="left"
                tabIndex={0}
                style={{
                  position: 'absolute',
                  right: '50px',
                  padding: '10px 0 10px',
                }}
                onKeyUp={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    requestsRef.current.focus();
                  }
                }}
              >
                <Icon
                  id="nav-jump"
                  icon="angle-double-down"
                  size="small"
                  ariaLabel="skip to request types"
                  handleClick={() => {
                    requestsRef.current.focus();
                  }}
                />
              </HoverOverInfo>
            </div>
            {dataErrors.missingCouncils && (
              <ErrorMessage errorType="selectone" />
            )}
            <NCSelector />
            <div
              className="flex"
              id="request-selection-container"
              ref={requestsRef}
              tabIndex={-1}
            >
              <InfoTitle
                title="Request Type Selection *"
                element="h2"
                infoText={[
                  'This filter allows the user to select specific 311 request types.',
                  '* Please check box to make one or more selections.',
                ]}
              />
              <HoverOverInfo
                title="Skip to Neighborhood Councils"
                position="left"
                tabIndex={0}
                style={{
                  position: 'absolute',
                  right: '50px',
                  padding: '10px 0 10px',
                }}
                onKeyUp={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    ncRef.current.focus();
                  }
                }}
              >
                <Icon
                  id="nav-jump"
                  icon="angle-double-up"
                  size="small"
                  ariaLabel="skip to neighborhood councils"
                  handleClick={() => {
                    ncRef.current.focus();
                  }}
                />
              </HoverOverInfo>
            </div>
            {dataErrors.missingRequestTypes && (
              <ErrorMessage errorType="selectone" />
            )}

            <RequestTypeSelector />
            <Submit setCErrors={setCErrors} setDErrors={setDErrors} />
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
