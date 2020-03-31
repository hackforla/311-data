import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import { Switch, Route } from 'react-router-dom';
import clx from 'classnames';

import Visualizations from '@components/Visualizations';
import Loader from '@components/common/Loader';
import Modal from '@components/common/Modal';
import TimeToCloseComparison from '@components/Visualizations/TimeToCloseComparison';
import Menu from '../menu/Menu';
import PinMap from '../../PinMap/PinMap';
import DataRequestError from './DataRequestError';

const Body = ({
  openErrorModal,
  error,
  menuIsOpen,
}) => (
  <div className="body is-relative">
    <Menu />
    <Switch>
      <Route path="/comparison">
        {/* <Visualizations /> */}
        <div className={clx('comparison', { 'full-width': !menuIsOpen })}>
          <TimeToCloseComparison />
        </div>
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

Body.propTypes = {
  error: PropTypes.shape({}),
  openErrorModal: PropTypes.bool.isRequired,
  menuIsOpen: PropTypes.bool.isRequired,
};

Body.defaultProps = {
  error: null,
};

const mapStateToProps = state => ({
  error: state.data.error,
  openErrorModal: state.ui.error.isOpen,
  menuIsOpen: state.ui.menu.isOpen,
});

export default connect(mapStateToProps, null)(Body);
