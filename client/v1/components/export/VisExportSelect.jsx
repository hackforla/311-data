import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { trackChartExport } from '@reducers/analytics';
import LoaderButton from '@components/common/LoaderButton';
import SelectItem from './SelectItem';
import { getMultiPagePdf } from './BlobFactory';

const VisExportSelect = ({
  trackExport,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

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
          <h3>Export Images</h3>
          <SelectItem
            label="PDF"
            filename="charts.pdf"
            getData={() => getMultiPagePdf()}
            onClick={() => {
              setOpen(false);
              setLoading(true);
              trackExport({
                pageArea: 'Data Visualizations',
                fileType: 'PDF',
                path: location.pathname,
              });
            }}
            onComplete={() => setLoading(false)}
          />
          {/* <div>Email</div>
          <div>Link</div>
          <div>Excel</div> */}
        </div>
      )}
    </span>
  );
};

const mapDispatchToProps = dispatch => ({
  trackExport: properties => dispatch(trackChartExport(properties)),
});

VisExportSelect.propTypes = {
  trackExport: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(VisExportSelect);
