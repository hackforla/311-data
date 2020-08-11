import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { MENU_TABS, MENU_MODES } from '@components/common/CONSTANTS';

const Loader = ({
  isLoading,
}) => {
  if (!isLoading) return null;

  return (
    <div className="loader-container">
      <div className="inner">
        <div className="loader" />
        <h2>Loading...</h2>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const { activeTab, activeMode } = state.ui.menu;
  return {
    isLoading: (
      state.comparisonData.isLoading
      || (state.data.isMapLoading && activeTab === MENU_TABS.MAP && activeMode === MENU_MODES.TRENDS)
      || (state.data.isVisLoading && activeTab === MENU_TABS.VISUALIZATIONS && activeMode === MENU_MODES.TRENDS)
    ),
  };
};

export default connect(mapStateToProps)(Loader);

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
