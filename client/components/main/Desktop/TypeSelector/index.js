/* eslint-disable */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateRequestTypes } from '@reducers/filters';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

const useStyles = makeStyles(theme => ({
  label: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
  },
}));

const useHeaderStyles = makeStyles(theme => ({
  header: {
    marginBottom: 5,
    display: 'inline-block',
    fontFamily: 'Roboto',
  }
}))

const RequestTypeSelector = ({
  requestTypes,
  updateTypesFilter,
  selectedTypes,
}) => {
  const [leftCol, setLeftCol] = useState();
  const [rightCol, setRightCol] = useState();
  const classes = useStyles();
  const headerClass = useHeaderStyles();

  useEffect(() => {
    if (requestTypes) {
      const mid = Math.ceil(requestTypes.length / 2);
      const left = requestTypes.slice(0, mid);
      const right = requestTypes.slice(-mid);
      setLeftCol(left);
      setRightCol(right);
    }
  }, [requestTypes]);

  return (
    <>
      <div className={headerClass.header}>Request Types</div>
      <Grid container style={{
        margin: 'auto',
        backgroundColor: '#192730',
        borderRadius: '5px',
        padding: '5px',
        // paddingTop: '3px',
        // paddingBottom: '3px',
      }}>
        <Grid item style={{ width: '50%' }}>
          <FormGroup>
            {leftCol && leftCol.map(type => (
              <FormControlLabel
                key={type.typeId}
                classes={classes}
                control={
                  <Checkbox 
                    style={{
                      transform: 'scale(0.8)',
                      color: type.color,
                      padding: '0 0 0 9px',
                    }}
                    checked={selectedTypes[type.typeId]}
                    
                    onChange={() => updateTypesFilter(type.typeId)}
                  />
                }
                label={type.typeName}
              /> 
            ))}
          </FormGroup>
        </Grid>
        <Grid item style={{ width: '50%' }}>
          <FormGroup>
            {rightCol && rightCol.map(type => (
              <FormControlLabel
                key={type.typeId}
                classes={classes}
                control={
                  <Checkbox 
                    style={{
                      transform: 'scale(0.8)',
                      color: type.color,
                      padding: '0 2px 0 9px',
                    }}
                    checked={selectedTypes[type.typeId]}
                    
                    onChange={() => updateTypesFilter(type.typeId)}
                  />
                }
                label={type.typeName}
              /> 
            ))}
          </FormGroup>
        </Grid>
      </Grid>
    </>
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
  selectedTypes: PropTypes.shape({}).isRequired,
};

RequestTypeSelector.defaultProps = {
  requestTypes: null,
};