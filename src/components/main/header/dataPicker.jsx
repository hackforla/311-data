import React from 'react';
import PropTypes from 'proptypes';

import { YEARS, MONTHS, REQUESTS, TIME_PERIOD } from '../../common/CONSTANTS';

const DataPicker = ({
  startMonth,
  endMonth,
  onDropdownSelect,
}) => {
  const handleOnChange = (e) => {
    const { id, value } = e.target;
    onDropdownSelect(id, value);
  };

  const renderDatePicker = () => {
    const options = {
      year: 'Year',
      // timePeriod: 'Time Period',
      startMonth: 'Start Month',
      endMonth: 'End Month',
      request: 'Service Requests',
    };

    return Object.keys(options).map((option) => {
      let component;
      const name = options[option];

      switch (name) {
        case 'Year':
          component = YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ));
          break;
        case 'Time Period': 
          component = TIME_PERIOD.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ));
          break;
        case 'Start Month':
          component = MONTHS.map((month, idx) => {
            const disable = endMonth < idx + 1;

            return (
              <option 
                key={month} 
                value={idx + 1}
                style={{ 
                  color: disable ? 'lightgrey' : null, 
                }} 
                disabled={disable}
              >
                {month}
              </option>
            );
          });
          break;
        case 'End Month':
          component = MONTHS.map((month, idx) => {
            const disable = startMonth > idx + 1;

            return (
              <option 
                key={month} 
                value={idx + 1}
                style={{ 
                  color: disable ? 'lightgrey' : null, 
                }}  
                disabled={disable}
              >
                {month}
              </option>
            );
          });
          break;
        case 'Service Requests':
          component = REQUESTS.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ));
          break;
        default:
          break;
      }

      return (
        <div className="field" key={option}>
          <label className="label">
            {name}
          </label>

          <div className="control">
            <div className="select">
              <select
                id={option}
                className="dropdown"
                defaultValue={option === 'endMonth' ? '12' : null}
                onChange={handleOnChange}
              >
                {component}
              </select>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="dropdown-container">
      {renderDatePicker()}
      {/* {showMarkerDropdown && (
        <>
          Show Markers
          <input type="checkbox" value="markers" checked={showMarkers} onChange={toggleShowMarkers} />
        </>
      )} */}
    </div>
  );
};

DataPicker.propTypes = {
  showMarkerDropdown: PropTypes.bool,
};

DataPicker.defaultProps = {
  showMarkerDropdown: true,
};

export default DataPicker;
