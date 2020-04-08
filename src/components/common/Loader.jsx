import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';

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

const mapStateToProps = state => ({
  isLoading: state.data.isLoading || state.comparisonData.isLoading,
});

export default connect(mapStateToProps)(Loader);

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
};
