import React from 'react';
import constants from '../../common/CONSTANTS';

export default ({
  showMarkerDropdown,
  showRequestsDropdown,
  serviceRequests,
  showMarkers,
  onChange,
  toggleShowMarkers,
}) => {
  const { YEARS, MONTHS } = constants;
  const options = {
    year: 'Year',
    startMonth: 'Start Month',
    endMonth: 'End Month',
  };

  if (showRequestsDropdown) {
    options.request = 'Service Requests';
  }

  const renderDatePicker = Object.keys(options).map(option => {
    let component;
    const name = options[option];

    switch (name) {
      case 'Year':
        component = YEARS.map(year => (<option key={year} value={year}>{year}</option>));
        break;
      case 'Start Month':
        component = MONTHS.map((month, idx) => (<option key={month} value={idx + 1}>{month}</option>));
        break;
      case 'End Month':
        component = MONTHS.map((month, idx) => (<option key={month} value={idx + 1}>{month}</option>));
        break;
      case 'Service Requests':
        component = serviceRequests.map(service => (<option key={service} value={service}>{service}</option>));
        break;
      default:
        break;
    }

    return (
      <React.Fragment key={option}>
        {name}
        &nbsp;
        <select id={option} className="dropdown" defaultValue={option === 'endMonth' ? '12' : null} onChange={onChange}>
          {component}
        </select>
        <br/>
      </React.Fragment>
    );
  });

  return (
    <div className="dropdown-container">
      {renderDatePicker}
      {showMarkerDropdown && (
        <>
          Show Markers
          <input type="checkbox" value="Markers" checked={showMarkers} onChange={toggleShowMarkers}/>
        </>
      )}
    </div>

  );
}
