/* eslint-disable quotes */
import React, { useContext, useEffect, useState } from 'react';
import {
  Portal,
  Button,
  Icon,
} from '@mui/material';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import moment from 'moment';
import JSZip from 'jszip';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import DbContext from '@db/DbContext';
import ddbh from '@utils/duckDbHelpers.js';
import { isEmpty } from '@utils';
import ExportIcon from '@assets/typcn_export.svg';
import requestTypes from '@data/requestTypes';
import useStyles from './useStyles';
import ExportDialog from './ExportDialog';

function ExportButton({ filters, disabled = false }) {
  const { conn } = useContext(DbContext);
  const classes = useStyles();
  const [showDialog, setShowDialog] = useState(false);
  const [errorType, setErrorType] = useState('');
  const [requestType, setRequestType] = useState('');
  const [selectionValidated, setSelectionValidated] = useState(false);
  const [exportConfirmed, setExportConfirmed] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [fileSize, setFileSize] = useState(0);

  const formattedRequestTypes = requestTypes
    .filter(item => filters.requestTypes[item.typeId])
    .map(reqType => `'${reqType.socrataNames[0]}'`)
    .join(', ');

  useEffect(() => {
    const downloadZip = async (neighborhoodCsvContent, srCsvContent) => {
      const zip = new JSZip();
      zip.file('NeighborhoodData.csv', neighborhoodCsvContent);

      // Only add SR count csv if it was generated
      if (srCsvContent) {
        zip.file('ServiceRequestCount.csv', srCsvContent);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      setFileSize(content.size);
      setShowDialog(true);
      setDialogType('confirmation');

      if (exportConfirmed) {
        setDialogType('downloading');
        try {
          saveAs(content, '311Data.zip');
          setDialogType('success');
        } catch {
          setDialogType('failed');
        } finally {
          setExportConfirmed(false);
          setSelectionValidated(false);
        }
      }
    };

    const getDataToExport = async () => {
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

      const startYear = moment(filters.startDate).year();
      const endYear = moment(filters.endDate).year();

      const getAllRequests = (year, startDate, endDate, councilId = '', status = '') => `
        SELECT * FROM requests_${year} 
        WHERE CreatedDate >= '${startDate}' 
        AND CreatedDate <= '${endDate}'
        ${status === 'Open' ? " AND (Status = 'Open' OR Status = 'Pending')" : ''}
        ${status === 'Closed' ? " AND (Status = 'Closed')" : ''}
        ${councilId !== null ? ` AND NC='${councilId}'` : ''} 
        AND RequestType IN (${formattedRequestTypes})`;

      // Note: this logic will only generate the SR count CSV if it meets the following conditions:
      // exactly one SR type is selected, a NC is selected, and status is Open or Pending.
      const groupRequestsByAddress = (year, startDate, endDate, councilId) => `
        SELECT Address, COUNT(*) AS NumberOfRequests FROM requests_${year}
        WHERE CreatedDate >= '${startDate}' 
        AND CreatedDate <= '${endDate}' 
        AND (Status = 'Open' OR Status = 'Pending')
        AND NC = '${councilId}' 
        AND RequestType IN (${formattedRequestTypes})
        GROUP BY Address`;

      const generateQuery = (grouped = false) => {
        if (startYear === endYear) {
          if (grouped) {
            // SRs grouped by address from same year
            return groupRequestsByAddress(
              startYear,
              filters.startDate,
              filters.endDate,
              filters.councilId,
            );
          }
          // data comes from same year and includes all columns matching filters
          return getAllRequests(
            startYear,
            filters.startDate,
            filters.endDate,
            filters.councilId,
            requestStatusFilter,
          );
        }

        const endOfStartYear = moment(filters.startDate).endOf('year').format('YYYY-MM-DD');
        const startOfEndYear = moment(filters.endDate).startOf('year').format('YYYY-MM-DD');

        // SRs grouped by address with different start and end years
        if (grouped) {
          return `(${groupRequestsByAddress(
            startYear,
            filters.startDate,
            endOfStartYear,
            filters.councilId,
          )}) UNION ALL (${groupRequestsByAddress(
            endYear,
            startOfEndYear,
            filters.endDate,
            filters.councilId,
          )})`;
        }

        // data with different start and end years and includes all columns matching filters
        return `(${getAllRequests(
          startYear,
          filters.startDate,
          endOfStartYear,
          filters.councilId,
          requestStatusFilter,
        )}) UNION ALL (${getAllRequests(
          endYear,
          startOfEndYear,
          filters.endDate,
          filters.councilId,
          requestStatusFilter,
        )})`;
      };

      const exportData = async () => {
        if (selectionValidated && dialogType === '') {
          try {
            const neighborhoodDataQuery = generateQuery();
            const neighborhoodDataToExport = await conn.query(neighborhoodDataQuery);
            const neighborhoodResults = ddbh.getTableData(neighborhoodDataToExport);
            const formattedResults = neighborhoodResults.map(row => ({
              ...row,
              CreatedDate: row.CreatedDate ? moment(row.CreatedDate).format('YYYY-MM-DD HH:mm:ss') : null,
              UpdatedDate: row.UpdatedDate ? moment(row.UpdatedDate).format('YYYY-MM-DD HH:mm:ss') : null,
              ServiceDate: row.ServiceDate ? moment(row.ServiceDate).format('YYYY-MM-DD HH:mm:ss') : null,
              ClosedDate: row.ClosedDate ? moment(row.ClosedDate).format('YYYY-MM-DD HH:mm:ss') : null,
            }));

            if (!isEmpty(formattedResults)) {
              const neighborhoodCsvContent = Papa.unparse(formattedResults);
              let groupedAddressesToExport;
              let srCountResults;
              let srCsvContent;

              // SR count csv data only generated if status is open
              if (requestStatusFilter === 'Open') {
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
              setSelectionValidated(false);
            }
          } catch {
            setDialogType('failed');
          }
        }
      };

      if (selectionValidated) {
        exportData();
      }
    };

    getDataToExport();
  }, [conn,
    dialogType,
    exportConfirmed,
    filters.councilId,
    filters.endDate,
    filters.requestStatus.closed,
    filters.requestStatus.open,
    filters.startDate,
    formattedRequestTypes,
    selectionValidated,
    showDialog]);

  const validateSelection = async () => {
    const multiSrTypesError = "Please select only \n one Request Type to \n export the file.";
    const noNCError = "Please select a \n Neighborhood District.";
    const noSrError = "Please select one \n Request Type.";
    const multiSrTypesAndNoNCError = "Please select a \n Neighborhood District \n & ONE Request Type.";
    const noSrTypeAndNoNCError = "Please select a \n Neighborhood District & \n one Request Type.";

    setSelectionValidated(false);
    setDialogType('');

    const srTypeCount = Object.values(filters.requestTypes).reduce(
      (acc, cur) => (cur === true ? acc + 1 : acc),
      0,
    );
    setRequestType(` ${formattedRequestTypes.slice(1, -1)}`);

    if (srTypeCount > 1 && filters.councilId === null) {
      setErrorType(multiSrTypesAndNoNCError);
    } else if (srTypeCount === 0 && filters.councilId === null) {
      setErrorType(noSrTypeAndNoNCError);
    } else if (srTypeCount > 1) {
      setErrorType(multiSrTypesError);
    } else if (srTypeCount === 0) {
      setErrorType(noSrError);
    } else if (filters.councilId === null) {
      setErrorType(noNCError);
    }

    setShowDialog(true);

    if (srTypeCount === 1 && filters.councilId) {
      setSelectionValidated(true);
    }
  };

  const handleExport = async () => {
    validateSelection();
  };

  const onClose = () => {
    setShowDialog(false);
    setErrorType('');
    setDialogType('');
    setExportConfirmed(false);
  };

  const onConfirmationClose = () => {
    setShowDialog(false);
    setExportConfirmed(false);
    setDialogType('canceled');
  };

  const onConfirm = () => {
    setExportConfirmed(true);
    setShowDialog(false);
    setDialogType('');
  };

  return (
    <>
      <Button variant="outlined" onClick={handleExport} className={classes.exportButton} disabled={disabled}>
        Export
        <Icon sx={{ fontSize: 18, mb: '3px', ml: '1px', opacity: disabled ? 0.3 : 1  }}>
          <img src={ExportIcon} alt="export icon" className={classes.imageIcon} />
        </Icon>
      </Button>

      {showDialog && (
        <Portal>
          <ExportDialog
            open={showDialog}
            onClose={onClose}
            onConfirmationClose={onConfirmationClose}
            errorType={errorType}
            requestType={requestType}
            setErrorType={setErrorType}
            dialogType={dialogType}
            onConfirm={onConfirm}
            fileSize={fileSize}
          />
        </Portal>
      )}
    </>
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
  disabled: PropTypes.bool,
};
