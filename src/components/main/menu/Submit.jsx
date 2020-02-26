import React from 'react';
import { connect } from 'react-redux';
import { getDataRequest } from '../../../redux/reducers/data';
import Button from '../../common/Button';

const Submit = ({
  getData,
}) => {
  const handleSubmit = () => {
    getData();
  };

  return (
    <div className="level" style={{ padding: '50px 192px' }}>
      <div className="level-item">
        <Button
          label="Submit"
          handleClick={handleSubmit}
        />
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  getData: () => dispatch(getDataRequest()),
});

export default connect(null, mapDispatchToProps)(Submit);
