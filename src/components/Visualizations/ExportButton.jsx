import React, { useState } from 'react';

const ExportButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <span
      className="export-button"
      onMouseOver={() => setOpen(true)}
      onFocus={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={() => setOpen(false)}
    >
      Export
      { open && (
        <div className="export-dropdown">
          <h3>Export Image</h3>
          <div>PDF</div>
          <div>Email</div>
          <div>Link</div>
          <div>Excel</div>
          <h3>Export Data</h3>
          <div>CSV</div>
          <div>Excel</div>
        </div>
      )}
    </span>
  );
};

export default ExportButton;
