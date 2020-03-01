import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import clx from 'classnames';
import { MENU_TABS } from '@components/common/CONSTANTS';
import Criteria from './Criteria';
import Legend from './Legend';
import NumberOfRequests from './NumberOfRequests';
import TimeToClose from './TimeToClose';
import Frequency from './Frequency';
import TotalRequests from './TotalRequests';
import Contact311 from './Contact311';
import TypeOfRequest from './TypeOfRequest';

const Visualizations = ({
  menuIsOpen,
  menuActiveTab,
}) => {
  if (menuActiveTab !== MENU_TABS.VISUALIZATIONS) return null;

  return (
    <div className={clx('visualizations', {
      'full-width': !menuIsOpen,
    })}
    >
      <Criteria />
      <Legend />
      <NumberOfRequests />
      <TimeToClose />
      <Frequency />
      <TotalRequests />
      <Contact311 />
      <TypeOfRequest />
    </div>
  );
};

const mapStateToProps = state => ({
  menuIsOpen: state.ui.menu.isOpen,
  menuActiveTab: state.ui.menu.activeTab,
});

export default connect(mapStateToProps)(Visualizations);

Visualizations.propTypes = {
  menuIsOpen: PropTypes.bool.isRequired,
  menuActiveTab: PropTypes.string.isRequired,
};
