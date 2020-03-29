import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';
import { Switch, Route } from 'react-router-dom';

import Visualizations from '@components/Visualizations';
import Loader from '@components/common/Loader';
import Modal from '@components/common/Modal';
import Menu from '../menu/Menu';
import PinMap from '../../PinMap/PinMap';
import DataRequestError from './DataRequestError';

const Body = ({
  openErrorModal,
  error,
}) => (
  <div className="body is-relative">
    <Menu />
    <Switch>
      <Route path="/comparison">
        {/* <Visualizations /> */}
        <div className="full-width">
          TESTAOSDHIJOASDUIOAS*(D*(ASDUASH*DHASDHIASD))
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
};

Body.defaultProps = {
  error: null,
};

const mapStateToProps = state => ({
  error: state.data.error,
  openErrorModal: state.ui.error.isOpen,
});

export default connect(mapStateToProps, null)(Body);
