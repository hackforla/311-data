import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';

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
  <div id="body-container" className="body is-relative">
    <Menu />
    <main id="body-wrap">
      <PinMap />
      <Visualizations />
      <Loader />
      <Modal
        open={openErrorModal}
        content={<DataRequestError error={error} />}
      />
    </main>
  </div>
);

Body.propTypes = {
  error: PropTypes.shape({}).isRequired,
  openErrorModal: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  error: state.data.error,
  openErrorModal: state.ui.error.isOpen,
});

export default connect(mapStateToProps, null)(Body);
