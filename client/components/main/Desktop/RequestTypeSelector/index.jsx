import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
// import InputLabel from '@material-ui/core/InputLabel';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import SelectorBox from '@components/common/SelectorBox';
import RequestTypeOptions from './RequestTypeOptions';

const RequestTypeSelector = ({
  requestTypes,
  selectedRequestTypes,
}) => {

  return (
    <div>
      
    </div>
  );
}

const mapStateToProps = state => ({
  requestTypes: state.metadata.requestTypes,
  selectedRequestTypes: state.filters.requestTypes,
});

const mapDispatchToProps = dispatch => ({
  selectType: type => dispatch(updateRequestType(type)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RequestTypeSelector);

RequestTypeSelector.propTypes = {};

RequestTypeSelector.defaultProps = {};



