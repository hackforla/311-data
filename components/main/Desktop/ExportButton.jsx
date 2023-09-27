import React from 'react';
import Button from '@material-ui/core/Button';

const ExportButton = () => {
  const handleExport = () => {
    // functional code for export
    console.log('Exporting to CSV');
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={handleExport}
      >
        Export
      </Button>
    </>
  );
};

export default ExportButton;
