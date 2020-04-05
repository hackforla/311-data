import React from 'react';
import { connect } from 'react-redux';
import propTypes from 'proptypes';
import { getDataRequest } from '../../../redux/reducers/data';
import Button from '../../common/Button';

const Submit = ({
  getData,
}) => {
  const handleSubmit = () => {
    getData();
  };

  return (
    <div className="level" style={{ padding: '25px 192px 15px' }}>
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
});

Submit.propTypes = {
  getData: propTypes.func,
};

Submit.defaultProps = {
  getData: () => null,
};

export default connect(null, mapDispatchToProps)(Submit);
