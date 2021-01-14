import React from 'react';
import PropTypes from 'proptypes';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {},
  option: {},
}));


const RequestTypeOptions = ({
  onClick,
  items,
}) => {
  const classes = useStyles()

  return (
    <>
      {items.map(item => (
        <div>{item.type_name}</div>
      ))}
    </>
  );
}

export default RequestTypeOptions;

RequestTypeOptions.propTypes = {
  onClick: PropTypes.func.isRequired,
};

RequestTypeOptions.defaultProps = {};