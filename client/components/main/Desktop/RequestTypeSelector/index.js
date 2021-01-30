import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateRequestTypes } from '@reducers/filters';

import SelectorBox from '@components/common/SelectorBox';
import SelectedTypes from './SelectedTypes';
import TypesList from './TypesList';

const RequestTypeSelector = ({
  requestTypes,
  updateTypesFilter,
  outlined,
}) => {
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    setTypes(requestTypes);
  }, [requestTypes]);

  const handleDelete = e => {
    const deletedTypeId = Number(e.currentTarget.dataset.id);
    const newSelectedTypes = selectedTypes.filter(({ typeId }) => typeId !== deletedTypeId);
    setSelectedTypes(newSelectedTypes);
    updateTypesFilter(newSelectedTypes);
  };

  const handleSelect = e => {
    const selectedTypeId = Number(e.currentTarget.value);
    if (!selectedTypes.some(({ typeId }) => typeId === selectedTypeId)) {
      const newSelectedType = types.find(({ typeId }) => typeId === selectedTypeId);
      const newTypes = [...selectedTypes, newSelectedType];
      setSelectedTypes(newTypes);
      updateTypesFilter(newTypes);
    }
  };

  return (
    <div>
      <SelectorBox>
        <SelectorBox.Display>
          { types && (
            <SelectedTypes outlined={outlined} items={selectedTypes} onDelete={handleDelete} />
          )}
        </SelectorBox.Display>
        <SelectorBox.Collapse>
          { types && (
            <TypesList
              onClick={handleSelect}
              items={types}
              selectedItems={selectedTypes}
            />
          )}
        </SelectorBox.Collapse>
      </SelectorBox>
    </div>
  );
};

const mapStateToProps = state => ({
  requestTypes: state.metadata.requestTypes,
});

const mapDispatchToProps = dispatch => ({
  updateTypesFilter: type => dispatch(updateRequestTypes(type)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RequestTypeSelector);

RequestTypeSelector.propTypes = {
  requestTypes: PropTypes.arrayOf(PropTypes.shape({
    typeId: PropTypes.number,
    typeName: PropTypes.string,
    color: PropTypes.string,
  })).isRequired,
  updateTypesFilter: PropTypes.func.isRequired,
};
