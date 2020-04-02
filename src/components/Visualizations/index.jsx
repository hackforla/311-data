import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { MENU_TABS } from '@components/common/CONSTANTS';
import VisExportSelect from '@components/export/VisExportSelect';
import Criteria from './Criteria';
import Legend from './Legend';
import NumberOfRequests from './NumberOfRequests';
import TimeToClose from './TimeToClose';
import Frequency from './Frequency';
import TotalRequests from './TotalRequests';
import Contact311 from './Contact311';
import TypeOfRequest from './TypeOfRequest';

const Visualizations = ({
  menuActiveTab,
}) => {
  if (menuActiveTab !== MENU_TABS.VISUALIZATIONS) return null;

  return (
    <div className="visualizations">
      <VisExportSelect />
      <div className="info-section">
        <Criteria />
        <Legend />
        <NumberOfRequests />
      </div>
      <div className="chart-row">
        <TimeToClose />
      </div>
      <div className="chart-row">
        <Frequency />
      </div>
      <div className="chart-row">
        <TotalRequests />
      </div>
      <div className="chart-row pies">
        <Contact311 />
        <TypeOfRequest />
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  menuActiveTab: state.ui.menu.activeTab,
});

export default connect(mapStateToProps)(Visualizations);

Visualizations.propTypes = {
  menuActiveTab: PropTypes.string.isRequired,
};
