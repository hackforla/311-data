/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { connect } from 'react-redux';

import Icon from '@components/common/Icon';
import Modal from '@components/common/Modal';
import HoverOverInfo from '@components/common/HoverOverInfo';
import DistrictSelectorModal from './DistrictSelectorModal';

const DistrictSelector = ({
  comparison,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [comparisonSet, setComparisonSet] = useState('set1');

  const openModal = set => {
    setComparisonSet(set);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const renderSet = set => {
    const renderHeader = type => {
      let header;

      switch (type) {
        case 'nc':
          header = 'Neighborhood Counsil';
          break;
        case 'cc':
          header = 'City Counsil';
          break;
        default:
          break;
      }

      return `${header} District`;
    };

    if (comparison?.[set]?.list.length > 0) {
      return (
        <div className={set} style={{ border: '1px solid black' }}>
          {renderHeader(comparison[set].type)}
          <br />
          {comparison[set].list}
        </div>
      );
    }

    return (
      <div onClick={() => openModal(set)}>
        <Icon
          id={`add-district-${set}`}
          icon="plus-circle"
          size="small"
        />
        &nbsp;
        Add District
      </div>
    );
  };

  return (
    <>
      <div className="container">
        <p className="is-size-6" style={{ padding: '15px 0' }}>
          <strong style={{ paddingRight: '10px' }}>
            District Selection
          </strong>
          <HoverOverInfo
            title="District Selection"
            text="This filter allows the user to select specific district boundaries."
          >
            <Icon
              id="district-selector-info-icon"
              icon="info-circle"
              size="small"
            />
          </HoverOverInfo>
        </p>
        {renderSet('set1')}
        <br />
        {renderSet('set2')}
      </div>
      <Modal
        open={modalOpen}
        content={(
          <DistrictSelectorModal
            set={comparisonSet}
            closeModal={closeModal}
          />
        )}
      />
    </>
  );
};

const mapStateToProps = state => ({
  comparison: state.filters.comparison,
});

export default connect(mapStateToProps)(DistrictSelector);
