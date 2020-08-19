import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import { Switch, Route } from 'react-router-dom';
import clx from 'classnames';

import Visualizations from '@components/Visualizations';
import Comparison from '@components/Comparison';
import Loader from '@components/common/Loader';
import Modal from '@components/common/Modal';
import Menu from '../menu/Menu';
import PinMap from '../../Mapbox';
import DataRequestError from './DataRequestError';

const Body = ({
  openErrorModal,
  error,
  menuIsOpen,
  isComparing,
}) => (
  <div className={clx('body', { 'menu-is-open': menuIsOpen })}>
    <Switch>
      <Route path="/comparison">
        <Menu />
        {isComparing
          ? <Comparison />
          : <Visualizations />
        }
      </Route>
      <Route path="/data">
        <PinMap />
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
  isComparing: PropTypes.bool.isRequired,
};

Body.defaultProps = {
  error: null,
};

const mapStateToProps = state => ({
  error: state.data.error,
  openErrorModal: state.ui.error.isOpen,
  menuIsOpen: state.ui.menu.isOpen,
  isComparing: state.ui.menu.isComparing,
});

export default connect(mapStateToProps, null)(Body);
