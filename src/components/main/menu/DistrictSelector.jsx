import React from 'react';
import { connect } from 'react-redux';

import Icon from '@components/common/Icon';
import HoverOverInfo from '@components/common/HoverOverInfo';

const DistrictSelector = () => {
  return (
    <div className="container">
      <p className="is-size-6" style={{ padding: '15px 0' }}>
        <strong style={{ paddingRight: '10px' }}>
          District Selection
        </strong>
        <HoverOverInfo
          title="District Selection"
          text="This filter allows the user to select specific district boundaries."
        >
          <Icon
            id="district-selector-info-icon"
            icon="info-circle"
            size="small"
          />
        </HoverOverInfo>
      </p>
      <div>
        <Icon
          id="add-district-1"
          icon="plus-circle"
          size="small"
        />
        &nbsp;
        Add District
      </div>
      <br />
      <div>
        <Icon
          id="add-district-2"
          icon="plus-circle"
          size="small"
        />
        &nbsp;
        Add District
      </div>
    </div>
  );
};

export default connect()(DistrictSelector);
