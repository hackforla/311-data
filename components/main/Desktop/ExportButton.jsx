import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import moment from 'moment';
import JSZip from 'jszip';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import DbContext from '@db/DbContext';
import ddbh from '@utils/duckDbHelpers.js';
import { isEmpty } from '@utils';
import requestTypes from '../../../data/requestTypes';

// export button main function
function ExportButton({ filters }) {
  const { conn } = useContext(DbContext);

  // creation zip file
  const downloadZip = async (neighborhoodCsvContent, srCsvContent) => {
    const zip = new JSZip();
    zip.file('NeighborhoodData.csv', neighborhoodCsvContent);

    // Only add SR count csv if it was generated
    if (srCsvContent) {
      zip.file('ServiceRequestCount.csv', srCsvContent);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, '311Data.zip');
  };

  // data to add into zip file, queries then add results
  const getDataToExport = async () => {
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

    const startYear = moment(filters.startDate).year();
    const endYear = moment(filters.endDate).year();

    const generateQuery = (grouped = false) => {
      if (startYear === endYear) {
        if (grouped) {
          return `SELECT Address, COUNT(*) AS NumberOfRequests FROM requests_${startYear}
            WHERE CreatedDate >= '${filters.startDate}' 
            AND CreatedDate < '${filters.endDate}' 
            AND Status = 'Open' 
            AND NC = '${filters.councilId}' 
            AND RequestType IN (${formattedRequestTypes})
            GROUP BY Address`;
        }
        return `SELECT * FROM requests_${startYear} 
          WHERE CreatedDate >= '${filters.startDate}' 
          AND CreatedDate < '${filters.endDate}'
          ${requestStatusFilter !== '' ? ` AND Status='${requestStatusFilter}'` : ''}
          ${filters.councilId !== null ? ` AND NC='${filters.councilId}'` : ''} 
          AND RequestType IN (${formattedRequestTypes});`;
      }

      const endOfStartYear = moment(filters.startDate).endOf('year').format('YYYY-MM-DD');
      const startOfEndYear = moment(filters.endDate).startOf('year').format('YYYY-MM-DD');

      if (grouped) {
        return `(SELECT Address, COUNT(*) AS NumberOfRequests FROM requests_${startYear}
          WHERE CreatedDate BETWEEN '${filters.startDate}' AND '${endOfStartYear}' 
          AND Status = 'Open' 
          AND NC = '${filters.councilId}' 
          AND RequestType IN (${formattedRequestTypes})
          GROUP BY Address)
          UNION ALL
          (SELECT Address, COUNT(*) AS NumberOfRequests FROM requests_${endYear}
          WHERE CreatedDate BETWEEN '${startOfEndYear}' AND '${filters.endDate}' 
          AND Status = 'Open' 
          AND NC = '${filters.councilId}' 
          AND RequestType IN (${formattedRequestTypes})
          GROUP BY Address)`;
      }
      return `(SELECT * FROM requests_${startYear} 
        WHERE CreatedDate BETWEEN '${filters.startDate}' AND '${endOfStartYear}'
        ${requestStatusFilter !== '' ? ` AND Status='${requestStatusFilter}'` : ''}
        ${filters.councilId !== null ? ` AND NC='${filters.councilId}'` : ''} 
        AND RequestType IN (${formattedRequestTypes}))
        UNION ALL
        (SELECT * FROM requests_${endYear} 
        WHERE CreatedDate BETWEEN '${startOfEndYear}' AND '${filters.endDate}'
        ${requestStatusFilter !== '' ? ` AND Status='${requestStatusFilter}'` : ''}
        ${filters.councilId !== null ? ` AND NC='${filters.councilId}'` : ''} 
        AND RequestType IN (${formattedRequestTypes}))`;
    };

    const neighborhoodDataQuery = generateQuery();
    const neighborhoodDataToExport = await conn.query(neighborhoodDataQuery);
    const neighborhoodResults = ddbh.getTableData(neighborhoodDataToExport);

    if (!isEmpty(neighborhoodResults)) {
      const neighborhoodCsvContent = Papa.unparse(neighborhoodResults);
      let groupedAddressesToExport;
      let srCountResults;
      let srCsvContent;

      const srTypeCount = Object.values(filters.requestTypes).reduce(
        (acc, cur) => (cur === true ? acc + 1 : acc),
        0,
      );

      // SR count csv data only generated if:
      // exactly one SR type is selected, NC selected, and status is open
      if (srTypeCount === 1 && filters.councilId && requestStatusFilter === 'Open') {
        const groupedAddressQuery = generateQuery(true);
        groupedAddressesToExport = await conn.query(groupedAddressQuery);
        srCountResults = ddbh.getTableData(groupedAddressesToExport);

        if (!isEmpty(srCountResults)) {
          srCsvContent = Papa.unparse(srCountResults);
        }
      }
      downloadZip(neighborhoodCsvContent, srCsvContent);
    } else {
      window.alert('No 311 data available within the selected filters. Please adjust your filters and try again.');
    }
  };

  // action upon clicking
  const handleExport = () => {
    getDataToExport(filters);
  };

  return (
    <Button variant="contained" onClick={handleExport}>
      Export
    </Button>

  );
}

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
