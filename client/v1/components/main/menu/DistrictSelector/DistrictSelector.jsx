/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import {
  clearComparisonSet,
} from '@reducers/comparisonFilters';
import propTypes from 'proptypes';

import Icon from '@components/common/Icon';
import Modal from '@components/common/Modal';
import CollapsibleList from '@components/common/CollapsibleList';
import { DISTRICT_TYPES } from '@components/common/CONSTANTS';
import DistrictSelectorModal from './DistrictSelectorModal';

const DistrictSelector = ({
  comparison,
  clearSet,
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
      const [header] = DISTRICT_TYPES.filter(district => district.id === type);
      return `${header.name} (Set ${set.charAt(set.length - 1)}):`;
    };

    if (comparison[set]?.district && comparison[set]?.list.length > 0) {
      return (
        <div className="comparison-set">
          <div className={set}>
            <span className="comparison-set-header">
              {renderHeader(comparison[set].district)}
            </span>
            <br />
            <CollapsibleList
              items={comparison[set].list}
              maxShown={10}
              delimiter="; "
              buttonId="toggle-show-more"
            />
          </div>
          <div className="clear-set-container">
            <Icon
              id={`clear-${set}`}
              icon="plus-circle"
              size="small"
              style={{
                color: '#D10000',
                transform: 'rotate(45deg)',
                cursor: 'pointer',
              }}
              handleClick={() => clearSet(set)}
            />
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={() => openModal(set)}
        tabIndex="0"
        role="button"
        onKeyUp={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            openModal(set);
          }
        }}
      >
        <Icon
          id={`add-district-${set}`}
          icon="plus-circle"
          size="small"
          style={{ cursor: 'pointer' }}
        />
        &nbsp;
        Add District
      </div>
    );
  };

  return (
    <>
      <div className="district-selector container">
        {renderSet('set1')}
        <br />
        {renderSet('set2')}
      </div>
      <Modal
        open={modalOpen}
        style={{ width: '417px' }}
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

const mapDispatchToProps = dispatch => ({
  clearSet: set => dispatch(clearComparisonSet(set)),
});

const mapStateToProps = state => ({
  comparison: state.comparisonFilters.comparison,
});

DistrictSelector.propTypes = {
  comparison: propTypes.shape({}).isRequired,
  clearSet: propTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DistrictSelector);
