import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateRequestTypes } from '@reducers/filters';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
// import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import sharedLayout from '@theme/layout';
import useToggle from './isToggle';

const useStyles = makeStyles(theme => ({
  iconStyle: {
    verticalAlign: 'middle',
  },
  header: {
    fontSize: '12.47px',
    fontWeight: theme.typography.fontWeightMedium,
  },
}));

const formStyles = makeStyles(() => ({
  label: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '12px',
  },
}));

const RequestTypeSelector = ({
  requestTypes,
  dispatchUpdateTypesFilter,
  selectedTypes,
}) => {
  const [leftCol, setLeftCol] = useState();
  const [rightCol, setRightCol] = useState();
  const [isToggled, toggle] = useToggle(true);

  // FormControlLabel related classes.
  const formClasses = formStyles();

  // All other classes.
  const classes = { ...useStyles(), ...sharedLayout() };

  useEffect(() => {
    if (requestTypes) {
      const sortedRequestTypes = requestTypes.sort((a, b) => a.orderId - b.orderId);
      const mid = Math.ceil(sortedRequestTypes.length / 2);
      const left = sortedRequestTypes.slice(0, mid);
      const right = sortedRequestTypes.slice(-mid);
      setLeftCol(left);
      setRightCol(right);
    }
  }, [requestTypes]);

  const checkAll = () => {
    toggle(!isToggled);
    return !isToggled;
  };

  function updateAll(isSelected) {
    requestTypes.forEach(type => {
      if (selectedTypes[type.typeId] !== isSelected) {
        dispatchUpdateTypesFilter(type.typeId);
      }
    });
  }

  return (
    <>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="body2" className={classes.header}>
            Request&nbsp;Types&nbsp;
            <Tooltip title="Info">
              <InfoOutlinedIcon className={classes.iconStyle} fontSize="inherit" />
            </Tooltip>
          </Typography>
        </Grid>
        <Grid item className={classes.marginTopSmall}>
          <Grid
            container
            style={{
              margin: 'auto',
              backgroundColor: '#192730',
              borderRadius: '5px',
              padding: '5px',
              paddingTop: '3px',
              paddingBottom: '3px',
            }}
          >
            {/* Request Types - Left Column */}
            <Grid item style={{ width: '50%' }}>
              <FormGroup>

                {/* Select All */}
                <FormControlLabel
                  key="all"
                  classes={formClasses}
                  control={(
                    <Checkbox
                      style={{
                        transform: 'scale(0.8)',
                        color: 'white',
                        padding: '0 0 0 9px',
                      }}
                      checked={Object.values(selectedTypes).every(val => val)}
                      onChange={() => updateAll(checkAll())}
                    />
                  )}
                  label="Select/Deselect All"
                />

                {/* Left Column Request Types */}
                {leftCol && leftCol.map(type => (
                  <FormControlLabel
                    key={type.typeId}
                    classes={formClasses}
                    control={(
                      <Checkbox
                        style={{
                          transform: 'scale(0.8)',
                          color: type.color,
                          padding: '0 0 0 9px',
                        }}
                        checked={selectedTypes[type.typeId]}
                        onChange={() => dispatchUpdateTypesFilter(type.typeId)}
                      />
                    )}
                    label={type.typeName}
                  />
                ))}

              </FormGroup>
            </Grid>

            {/* Request Types - Right Column */}
            <Grid item style={{ width: '50%' }}>
              <FormGroup>

                {/* Right Column Request Types */}
                {rightCol && rightCol.map(type => (
                  <FormControlLabel
                    key={type.typeId}
                    classes={formClasses}
                    control={(
                      <Checkbox
                        style={{
                          transform: 'scale(0.8)',
                          color: type.color,
                          padding: '0 2px 0 9px',
                        }}
                        checked={selectedTypes[type.typeId]}
                        onChange={() => dispatchUpdateTypesFilter(type.typeId)}
                      />
                    )}
                    label={type.typeName}
                  />
                ))}
              </FormGroup>
            </Grid>
          </Grid>
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
  dispatchUpdateTypesFilter: type => dispatch(updateRequestTypes(type)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RequestTypeSelector);

RequestTypeSelector.propTypes = {
  requestTypes: PropTypes.arrayOf(PropTypes.shape({})),
  dispatchUpdateTypesFilter: PropTypes.func.isRequired,
  selectedTypes: PropTypes.shape({}).isRequired,
};

RequestTypeSelector.defaultProps = {
  requestTypes: null,
};
