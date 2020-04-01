import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'proptypes';
import { useLocation } from 'react-router-dom';
import { getDataRequest } from '@reducers/data';
import { getComparisonDataRequest } from '@reducers/comparisonData';
import Button from '@components/common/Button';

const Submit = ({
  getData,
  getComparisonData,
}) => {
  const { pathname } = useLocation();

  const handleSubmit = () => {
    switch (pathname) {
      case '/': return getData();
      case '/comparison': return getComparisonData();
      default: return null;
    }
  };

  return (
    <div className="level" style={{ padding: '50px 192px' }}>
      <div className="level-item">
        <Button
          id="sidebar-submit-button"
          label="Submit"
          handleClick={handleSubmit}
        />
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => ({
  getData: () => dispatch(getDataRequest()),
  getComparisonData: () => dispatch(getComparisonDataRequest()),
});

Submit.propTypes = {
  getData: propTypes.func,
  getComparisonData: propTypes.func,
};

Submit.defaultProps = {
  getData: () => null,
  getComparisonData: () => null,
};

export default connect(null, mapDispatchToProps)(Submit);
