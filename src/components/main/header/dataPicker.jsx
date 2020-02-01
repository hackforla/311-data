import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'proptypes';

import {
  updateYear,
  updateEndMonth,
  updateStartMonth,
  updateRequestType,
  updateNeighborhoodCounsil,
} from '../../../redux/reducers/data';

import {
  YEARS, MONTHS, REQUESTS, COUNCILS,
} from '../../common/CONSTANTS';

  // const buildDataUrl = () => {
  //   return `https://data.lacity.org/resource/${dataResources[year]}.json?$select=location,zipcode,address,requesttype,status,ncname,streetname,housenumber&$where=date_extract_m(CreatedDate)+between+${startMonth}+and+${endMonth}+and+requesttype='${request}'`;
  // };

const DataPicker = ({
  showMarkers,
  showMarkerDropdown,
  onDropdownSelect,
  toggleShowMarkers,
  handleUpdateYear,
  handleUpdateEndMonth,
  handleUpdateStartMonth,
  handleUpdateRequestType,
  handleUpdateNeighborhoodCounsil,
}) => {
  const handleOnChange = (e) => {
    const { id, value } = e.target;

    switch (id) {
      case 'year':
        handleUpdateYear(value);
        break;
      case 'startMonth':
        handleUpdateStartMonth(value);
        break;
      case 'endMonth':
        handleUpdateEndMonth(value);
        break;
      case 'requestType':
        handleUpdateRequestType(value);
        break;
      case 'counsil':
        handleUpdateNeighborhoodCounsil(value);
        break;
      default:
        break;
    }
  };

  const renderDatePicker = () => {
    const options = {
      year: 'Year',
      startMonth: 'Start Month',
      endMonth: 'End Month',
      requestType: 'Service Requests',
      counsil: 'Neighborhood Counsils',
    };

    return Object.keys(options).map((option) => {
      let component;
      const name = options[option];

      switch (name) {
        case 'Counsil':
          component = COUNCILS.map((counsil) => (
            <option key={counsil} value={counsil}>
              {counsil}
            </option>
          ));
          break;
        case 'Year':
          component = YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ));
          break;
        case 'Start Month':
          component = MONTHS.map((month, idx) => (
            <option key={month} value={idx + 1}>
              {month}
            </option>
          ));
          break;
        case 'End Month':
          component = MONTHS.map((month, idx) => (
            <option key={month} value={idx + 1}>
              {month}
            </option>
          ));
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
        <React.Fragment key={option}>
          {name}
          &nbsp;
          <select
            id={option}
            className="dropdown"
            defaultValue={option === 'endMonth' ? '12' : null}
            onChange={handleOnChange}
          >
            {component}
          </select>
          <br />
        </React.Fragment>
      );
    });
  };

  return (
    <div className="dropdown-container">
      {renderDatePicker()}
      {showMarkerDropdown && (
        <>
          Show Markers
          <input type="checkbox" value="markers" checked={showMarkers} onChange={toggleShowMarkers} />
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  year: state.year,
  startMonth: state.startMonth,
  endMonth: state.endMonth,
  requestType: state.requestType,
});

const mapDispatchToProps = (dispatch) => ({
  handleUpdateYear: (year) => dispatch(updateYear(year)),
  handleUpdateEndMonth: (endMonth) => dispatch(updateEndMonth(endMonth)),
  handleUpdateStartMonth: (startMonth) => dispatch(updateStartMonth(startMonth)),
  handleUpdateRequestType: (requestType) => dispatch(updateRequestType(requestType)),
  handleUpdateNeighborhoodCounsil: (counsil) => dispatch(updateNeighborhoodCounsil(counsil)),
});

DataPicker.propTypes = {
  showMarkerDropdown: PropTypes.bool,
};

DataPicker.defaultProps = {
  showMarkerDropdown: true,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataPicker);
