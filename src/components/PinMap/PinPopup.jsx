import React from 'react';
import PropTypes from 'proptypes';
import moment from 'moment';

import { Popup } from 'react-leaflet';

const PinPopup = ({
  displayName,
  color,
  abbrev,
  address,
  createdDate,
  updatedDate,
  closedDate,
  status,
  ncName,
}) => {
  // Converts unix timestamp to MM/DD/YYYY
  // 1558945500 -> 5/27/2019
  const created = moment.unix(createdDate).format('l');
  const updated = moment.unix(updatedDate).format('l');
  // Converts date/time string to MM/DD/YYYY
  // "2019-12-13 19:31:00" -> 12/13/2019
  const closed = moment(closedDate).format('l');

  return (
    <Popup className="pin-popup">
      { createdDate ? (
        <>
          <p className="pin-popup-type has-text-weight-bold">
            {displayName}
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
      ) : (
        <>
          <div className="loader" />
          <p>Loading...</p>
        </>
      )}
    </Popup>
  );
};

export default PinPopup;

PinPopup.propTypes = {
  displayName: PropTypes.string,
  color: PropTypes.string,
  abbrev: PropTypes.string,
  address: PropTypes.string,
  createdDate: PropTypes.number,
  updatedDate: PropTypes.number,
  closedDate: PropTypes.string,
  status: PropTypes.string,
  ncName: PropTypes.string,
};

PinPopup.defaultProps = {
  displayName: undefined,
  color: 'black',
  abbrev: undefined,
  address: undefined,
  createdDate: undefined,
  updatedDate: undefined,
  closedDate: undefined,
  status: undefined,
  ncName: undefined,
};
