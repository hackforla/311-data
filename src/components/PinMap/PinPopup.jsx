import React from 'react';
import PropTypes from 'proptypes';
import moment from 'moment';

import { Popup } from 'react-leaflet';

import { REQUEST_TYPES } from '@components/common/CONSTANTS';

const PinPopup = ({
  requestType,
  address,
  createdDate,
  updatedDate,
  closedDate,
  status,
  ncName,
}) => {
  const { color, abbrev } = REQUEST_TYPES.find(req => req.type === requestType
    || req.fullType === requestType);
  const created = moment.unix(createdDate).format('l');
  const updated = moment.unix(updatedDate).format('l');
  const closed = moment(closedDate).format('l');

  return (
    <Popup className="pin-popup">
      { createdDate ? (
        <>
          <p className="pin-popup-type has-text-weight-bold">
            {requestType}
            &nbsp;
            [
            <span className="pin-popup-type-abbrev" style={{ color }}>
              {abbrev}
            </span>
            ]
          </p>
          <p className="pin-popup-ncname">{ncName}</p>
          <p className="pin-popup-address has-text-weight-bold">{address}</p>

          <div className="pin-popup-status">
            <p>
              Reported on&nbsp;
              {created}
            </p>
            {
              closedDate ? (
                <p>
                  Closed on&nbsp;
                  {closed}
                </p>
              ) : (
                <>
                  <p>
                    Last updated on&nbsp;
                    {updated}
                  </p>
                  <p>
                    Status:&nbsp;
                    {status}
                  </p>
                </>
              )
            }
          </div>
        </>
      ) : <div className="pin-popup-loading">Loading</div>}
    </Popup>
  );
};

export default PinPopup;

PinPopup.propTypes = {
  requestType: PropTypes.string,
  address: PropTypes.string,
  createdDate: PropTypes.number,
  updatedDate: PropTypes.number,
  closedDate: PropTypes.string,
  status: PropTypes.string,
  ncName: PropTypes.string,
};

PinPopup.defaultProps = {
  requestType: undefined,
  address: undefined,
  createdDate: undefined,
  updatedDate: undefined,
  closedDate: undefined,
  status: undefined,
  ncName: undefined,
};
