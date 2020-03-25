import React, { useState } from 'react';
import LoaderButton from '@components/common/LoaderButton';
import SelectItem from './SelectItem';
import { getMultiPagePdf } from './BlobFactory';

const VisExportSelect = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <span
      className="vis-export-select"
      onMouseOver={() => setOpen(true)}
      onFocus={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={() => setOpen(false)}
    >
      <LoaderButton
        label="Export Page"
        className="cta-button"
        loading={loading}
      />
      { open && (
        <div className="export-dropdown">
          <h3>Export Image</h3>
          <SelectItem
            label="PDF"
            filename="charts.pdf"
            getData={() => getMultiPagePdf()}
            onClick={() => {
              setOpen(false);
              setLoading(true);
            }}
            onComplete={() => setLoading(false)}
          />
          <div>Email</div>
          <div>Link</div>
          <div>Excel</div>
        </div>
      )}
    </span>
  );
};

export default VisExportSelect;
