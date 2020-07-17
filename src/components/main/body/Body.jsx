import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import { Switch, Route } from 'react-router-dom';
import clx from 'classnames';

import About from '@components/about/About';
import Visualizations from '@components/Visualizations';
import Comparison from '@components/Comparison';
import Loader from '@components/common/Loader';
import Modal from '@components/common/Modal';
import Menu from '../menu/Menu';
import PinMap from '../../PinMap/PinMap';
import DataRequestError from './DataRequestError';

const Body = ({
  openErrorModal,
  error,
  menuIsOpen,
  splashPageDisabled,
}) => {
  if (splashPageDisabled) {
    return (
      <div className={clx('body', { 'menu-is-open': menuIsOpen })}>
        <Menu />
        <Switch>
          <Route path="/comparison">
            <Comparison />
          </Route>
          <Route path="/">
            <PinMap />
            <Visualizations />
          </Route>
        </Switch>
        <Loader />
        <Modal
          open={openErrorModal}
          content={<DataRequestError error={error} />}
        />
      </div>
    );
  }
  return <About />;
};

Body.propTypes = {
  error: PropTypes.shape({}),
  openErrorModal: PropTypes.bool.isRequired,
  menuIsOpen: PropTypes.bool.isRequired,
  splashPageDisabled: PropTypes.bool.isRequired,
};

Body.defaultProps = {
  error: null,
};

const mapStateToProps = state => ({
  error: state.data.error,
  openErrorModal: state.ui.error.isOpen,
  menuIsOpen: state.ui.menu.isOpen,
  splashPageDisabled: state.ui.splashPageDisabled,
});

export default connect(mapStateToProps, null)(Body);
