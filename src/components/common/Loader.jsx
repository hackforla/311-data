import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import clx from 'classnames';

const Loader = ({
  isLoading,
  menuIsOpen,
}) => {
  if (!isLoading) return null;

  return (
    <div className={clx('loader-container', { 'full-width': !menuIsOpen })}>
      <div className="inner">
        <div className="loader" />
        <h2>Loading...</h2>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  isLoading: state.data.isLoading,
  menuIsOpen: state.ui.menu.isOpen,
});

export default connect(mapStateToProps)(Loader);

Loader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  menuIsOpen: PropTypes.bool.isRequired,
};
