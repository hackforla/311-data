import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { trackChartExport } from '@reducers/analytics';
import LoaderButton from '@components/common/LoaderButton';
import SelectItem from './SelectItem';
import { getImage, getCsv, getSinglePagePdf } from './BlobFactory';

const ChartExportSelect = ({
  componentName,
  pdfTemplateName,
  exportData,
  filename,
  trackExport,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { pathname } = useLocation();

  return (
    <span
      className="chart-export-select"
      onFocus={() => setOpen(true)}
      onClick={() => setOpen(true)}
      onKeyUp={e => {
        if (e.key === 'Enter' || e.key === ' ') { setOpen(!open); }
      }}
      tabIndex="0"
      role="button"
    >
      <LoaderButton
        label="Export"
        loading={loading}
      />
      { open && (
        <div className="export-dropdown">

          <h3>Export Image</h3>
          <SelectItem
            label="PNG"
            filename={`${filename}.png`}
            getData={() => getImage(componentName)}
            onClick={() => {
              setOpen(false);
              setLoading(true);
              trackExport({
                pageArea: `${filename} Chart`,
                fileType: 'PNG',
                path: pathname,
              });
            }}
            onComplete={() => setLoading(false)}
          />
          <SelectItem
            label="PDF"
            filename={`${filename}.pdf`}
            getData={() => getSinglePagePdf({
              componentName,
              templateName: pdfTemplateName,
              pdfTitle: filename,
            })}
            onClick={() => {
              setOpen(false);
              setLoading(true);
              trackExport({
                pageArea: `${filename} Chart`,
                fileType: 'PDF',
                path: pathname,
              });
            }}
            onComplete={() => setLoading(false)}
          />
          {/* <div>Email</div>
          <div>Link</div>
          <div>Excel</div> */}

          <h3>Export Data</h3>
          <SelectItem
            label="CSV"
            filename={`${filename}.csv`}
            getData={() => getCsv(exportData())}
            onClick={() => {
              setOpen(false);
              trackExport({
                pageArea: `${filename} Chart`,
                fileType: 'CSV',
                path: pathname,
              });
            }}
          />
          {/* <div>Excel</div> */}

        </div>
      )}
    </span>
  );
};

const mapDispatchToProps = dispatch => ({
  trackExport: properties => dispatch(trackChartExport(properties)),
});

export default connect(null, mapDispatchToProps)(ChartExportSelect);

ChartExportSelect.propTypes = {
  componentName: PropTypes.string,
  pdfTemplateName: PropTypes.string,
  exportData: PropTypes.func,
  filename: PropTypes.string,
  trackExport: PropTypes.func.isRequired,
};

ChartExportSelect.defaultProps = {
  componentName: undefined,
  pdfTemplateName: undefined,
  exportData: () => null,
  filename: undefined,
};
