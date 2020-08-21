import React from 'react';
import propTypes from 'proptypes';

const ErrorMessage = ({
  errorType,
}) => {
  const setErrorMessage = () => {
    switch (errorType) {
      case 'selectone': {
        return '* Please choose at least one selection';
      }
      case 'data': {
        return '* Please select a date range';
      }
      case 'districtset': {
        return '* Please choose two districts';
      }
      default: return null;
    }
  };

  const errorMessage = setErrorMessage();

  const missingSelectorWarning = React.createElement('p', {
    style: {
      color: 'red',
      margin: '0 0 10px 0',
      fontSize: '0.75rem',
    },
  }, errorMessage);

  return (
    missingSelectorWarning
  );
};

export default ErrorMessage;

ErrorMessage.propTypes = {
  errorType: propTypes.string.isRequired,
};
