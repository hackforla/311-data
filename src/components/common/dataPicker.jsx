import React from 'react';

const years = [
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const options = [
  'Year',
  'Start Month',
  'End Month',
  'Service Requests',
];

export default ({
  showMarkerDropdown,
  showRequestsDropdown,
  serviceRequests,
  showMarkers,
  onChange,
  toggleShowMarkers,
}) => {
  const renderDatePicker = options.map(option => {
    let component;

    switch (option) {
      case 'Year':
        component = years.map(year => (<option key={year} value={year}>{year}</option>));
        break;
      case 'Start Month':
        component = months.map((month, idx) => (<option key={month} value={idx + 1}>{month}</option>));
        break;
      case 'End Month':
        component = months.map((month, idx) => (<option key={month} value={idx + 1}>{month}</option>));
        break;
      case 'Service Requests':
        component = serviceRequests.map(service => (<option key={service} value={service}>{service}</option>));
        break;
      default:
        break;
    }

    return (
      <React.Fragment key={option}>
        {option}
        &nbsp;
        <select id={option} className="dropdown" defaultValue={option === 'End Month' ? '12' : null} onChange={onChange}>
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
