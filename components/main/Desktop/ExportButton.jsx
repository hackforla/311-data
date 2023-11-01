import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import JSZip from 'jszip';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import DbContext from '@db/DbContext';
import ddbh from '@utils/duckDbHelpers.js';
import { isEmpty } from '@utils';
import requestTypes from '../../../data/requestTypes';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// TO DO ------
// x button
// querying filters:
//      x status
//      x date
//      - request type
//      x neighborhood (Object NC:  54 | NCName: "MacArthur Park")
//         councilId : 38 endDate : "2023-10-13"
// x CSV

// export button main function
const ExportButton = ({ filters }) => {
  const { conn } = useContext(DbContext);

  // creation zip file
  const downloadZip = async csvContent => {
    const zip = new JSZip();
    zip.file('NeighborhoodData.csv', csvContent);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, '311Data.zip');
  };

  // data to add into zip file, queries then add results
  const getDataToExport = async () => {
    // test
    // console.log('getDataToExport: filters:', filters);
    // console.log('this is request type consoling', filters.requestTypes)

    // define request status filter variable to reuse variable
    let requestStatusFilter = '';

    if (filters.requestStatus.open === true && filters.requestStatus.closed === false) {
      // Only open is true, get all open requests
      // query = `SELECT * FROM requests WHERE Status='Open';`;
      requestStatusFilter = 'Open';
    } else if (filters.requestStatus.closed === true && filters.requestStatus.open === false) {
      // Only closed is true, get all closed requests
      // query = `SELECT * FROM requests WHERE Status='Closed';`;
      requestStatusFilter = 'Closed';
    }

    const formattedRequestTypes = requestTypes
      .filter(item => filters.requestTypes[item.typeId])
      .map(v => `'${v.typeName}'`)
      .join(', ');
    // console.log('formattedRequestTypes', formattedRequestTypes);

    // // in the case user chooses one neighborhood or all are selected + dates and status
    const query = `select * from requests where CreatedDate >= '${filters.startDate}' AND
    CreatedDate < '${filters.endDate}'${requestStatusFilter !== ''
      ? ` AND Status='${requestStatusFilter}'` : ''}
    ${filters.councilId !== null
        ? ` AND NC='${filters.councilId}'` : ''} AND RequestType IN (${formattedRequestTypes});`;

    // console.log('query', query);
    // return;

    const dataToExport = await conn.query(query);
    const results = ddbh.getTableData(dataToExport);

    console.log('got results - length: ', results.length);
    if (!isEmpty(results)) {
      // test
      // console.log('logging results: ... ');
      // console.log(results.slice(0, 5));
      // results chosen to csv
      const csvContent = Papa.unparse(results);
      downloadZip(csvContent);
    }
  };

  // action upon clicking
  const handleExport = () => {
    getDataToExport(filters);
  };

  return (
    <>
      <Button variant="contained" onClick={handleExport}>
        Export
      </Button>
    </>
  );
};

const mapStateToProps = state => ({
  filters: state.filters,
});

export default connect(mapStateToProps)(ExportButton);

ExportButton.propTypes = {
  filters: PropTypes.shape({
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    councilId: PropTypes.number,
    requestStatus: PropTypes.shape({
      open: PropTypes.bool,
      closed: PropTypes.bool,
    }),
    requestTypes: PropTypes.objectOf(PropTypes.bool),
  }).isRequired,
};
