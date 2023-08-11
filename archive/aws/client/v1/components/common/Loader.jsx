import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { MENU_TABS } from '@components/common/CONSTANTS';

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
  const { activeTab } = state.ui.menu;
  return {
    isLoading: (
      state.comparisonData.isLoading
      || (state.data.isMapLoading && activeTab === MENU_TABS.MAP)
      || (state.data.isVisLoading && activeTab === MENU_TABS.VISUALIZATIONS)
    ),
  };
};

export default connect(mapStateToProps)(Loader);

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
