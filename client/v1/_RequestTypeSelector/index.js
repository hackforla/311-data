import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateRequestTypes } from '@reducers/filters';
import not from '@utils/not';
import { makeStyles } from '@material-ui/core/styles';

import SelectorBox from '@components/common/SelectorBox';
import SelectedTypes from './SelectedTypes';
import TypesList from './TypesList';

const useStyles = makeStyles(theme => ({
  label: {
    display: 'inline-block',
    font: theme.typography.b2,
    marginBottom: '10px',
    color: theme.palette.secondary.light,
  },
}));

const RequestTypeSelector = ({
  requestTypes,
  updateTypesFilter,
}) => {
  const [types, setTypes] = useState([]);
  const [selected, setSelected] = useState([]);
  const [unselected, setUnselected] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setTypes(requestTypes);
    setUnselected(requestTypes);
  }, [requestTypes]);

  const handleDelete = e => {
    const deletedTypeId = Number(e.currentTarget.dataset.id);
    const newSelected = selected.filter(({ typeId }) => typeId !== deletedTypeId);
    const newUnselected = not(types, newSelected, 'typeId');
    setSelected(newSelected);
    setUnselected(newUnselected);
    updateTypesFilter(newSelected);
  };

  const handleSelect = e => {
    const selectedTypeId = Number(e.currentTarget.value);
    if (!selected.some(({ typeId }) => typeId === selectedTypeId)) {
      const newSelectedType = types.find(({ typeId }) => typeId === selectedTypeId);
      const newSelected = [...selected, newSelectedType];
      const newUnselected = not(types, newSelected, 'typeId');
      setSelected(newSelected);
      setUnselected(newUnselected);
      updateTypesFilter(newSelected);
    }
  };

  return (
    <>
      <div className={classes.label}>Request Types</div>
      <SelectorBox>
        <SelectorBox.Display>
          { types && (
            <SelectedTypes items={selected} onDelete={handleDelete} />
          )}
        </SelectorBox.Display>
        <SelectorBox.Collapse>
          { types && (
            <TypesList
              items={unselected}
              selected={selected}
              onClick={handleSelect}
            />
          )}
        </SelectorBox.Collapse>
      </SelectorBox>
    </>
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
  requestTypes: PropTypes.arrayOf(PropTypes.shape({})),
  updateTypesFilter: PropTypes.func.isRequired,
};

RequestTypeSelector.defaultProps = {
  requestTypes: null,
};
