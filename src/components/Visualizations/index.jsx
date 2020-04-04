import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { MENU_TABS } from '@components/common/CONSTANTS';
import VisExportSelect from '@components/export/VisExportSelect';
import SnapshotService from '@components/export/SnapshotService';
import Criteria from '@components/chartExtras/Criteria';
import Legend from '@components/chartExtras/Legend';
import NumberOfRequests from '@components/chartExtras/NumberOfRequests';
import TimeToClose from './TimeToClose';
import Frequency from './Frequency';
import TotalRequests from './TotalRequests';
import Contact311 from './Contact311';
import TypeOfRequest from './TypeOfRequest';

SnapshotService.register({
  NumberOfRequests,
  TimeToClose,
  Frequency,
  TotalRequests,
  Contact311,
  TypeOfRequest,
});

const Visualizations = ({
  menuActiveTab,
}) => {
  if (menuActiveTab !== MENU_TABS.VISUALIZATIONS) return null;

  return (
    <div className="visualizations">
      <VisExportSelect />
      <div className="chart-extras">
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
