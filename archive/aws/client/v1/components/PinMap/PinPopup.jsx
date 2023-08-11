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
}) => (
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
            {moment.unix(createdDate).format('l')}
          </p>
          {
            closedDate ? (
              <p>
                Closed on&nbsp;
                {moment.unix(closedDate).format('l')}
              </p>
            ) : (
              <>
                <p>
                  Last updated on&nbsp;
                  {moment.unix(updatedDate).format('l')}
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

export default PinPopup;

PinPopup.propTypes = {
  displayName: PropTypes.string,
  color: PropTypes.string,
  abbrev: PropTypes.string,
  address: PropTypes.string,
  createdDate: PropTypes.number,
  updatedDate: PropTypes.number,
  closedDate: PropTypes.number,
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
