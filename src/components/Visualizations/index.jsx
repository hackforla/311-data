import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { MENU_TABS } from '@components/common/CONSTANTS';
import VisExportSelect from '@components/export/VisExportSelect';
import SnapshotService from '@components/export/SnapshotService';
import Criteria from '@components/chartExtras/Criteria';
import Legend from '@components/chartExtras/Legend';
import NumberOfRequests from '@components/chartExtras/NumberOfRequests';
import VisualizationsPlaceholder from '@components/Visualizations/VisualizationsPlaceholder';
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
  chartsVisibility,
}) => {
  if (menuActiveTab !== MENU_TABS.VISUALIZATIONS) {
    return null;
  }

  if (chartsVisibility) {
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
  }

  return <VisualizationsPlaceholder />;
};

const mapStateToProps = state => ({
  menuActiveTab: state.ui.menu.activeTab,
  chartsVisibility: state.ui.showDataCharts,
});

export default connect(mapStateToProps)(Visualizations);

Visualizations.propTypes = {
  menuActiveTab: PropTypes.string.isRequired,
  chartsVisibility: PropTypes.bool.isRequired,
};
