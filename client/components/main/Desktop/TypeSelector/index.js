/* eslint-disable */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateRequestTypes } from '@reducers/filters';
import not from '@utils/not';
import { makeStyles } from '@material-ui/core/styles';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

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
  selectedTypes,
}) => {
  const [leftCol, setLeftCol] = useState();
  const [rightCol, setRightCol] = useState();
  // const classes = useStyles();

  useEffect(() => {
    if (requestTypes) {
      const mid = Math.ceil(requestTypes.length / 2);
      const left = requestTypes.splice(0, mid);
      const right = requestTypes.splice(-mid);
      setLeftCol(left);
      setRightCol(right);
    }
  }, [requestTypes]);

  const handleChange = e => {
    const selectedId = Number(e.target.value);
    const updatedTypes = selectedTypes.includes(selectedId) ?
      selectedTypes.filter(({typeId}) => typeId !== selectedId) :
      [...selectedTypes, selectedId];
    updateTypesFilter(updatedTypes);
  };

  return (
    <FormGroup>
      {leftCol && leftCol.map(type => (
        <FormControlLabel
          key={type.typeId}
          control={
            <Checkbox 
              size="small"
              checked={selectedTypes.includes(type.typeId)}
              onChange={handleChange}
              value={type.typeId}
            />
          }
          label={
            <>
              <FiberManualRecordIcon 
                style={{ color: type.color }}
              />
              {type.typeName}
            </>
          }
        /> 
      ))}
    </FormGroup>
  );
};

const mapStateToProps = state => ({
  requestTypes: state.metadata.requestTypes,
  selectedTypes: state.filters.requestTypes,
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
  selectedTypes: PropTypes.arrayOf(PropTypes.number).isRequired,
};

RequestTypeSelector.defaultProps = {
  requestTypes: null,
};