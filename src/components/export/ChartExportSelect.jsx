import React, { useState } from 'react';
import PropTypes from 'proptypes';
import LoaderButton from '@components/common/LoaderButton';
import SelectItem from './SelectItem';
import { getImage, getCsv, getSinglePagePdf } from './BlobFactory';

const ChartExportSelect = ({
  chartId,
  chartTitle,
  exportData,
  style,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <span
      className="chart-export-select"
      onMouseOver={() => setOpen(true)}
      onFocus={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={() => setOpen(false)}
      style={style}
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
            filename={`${chartTitle}.png`}
            getData={() => getImage(chartId)}
            onClick={() => {
              setOpen(false);
              setLoading(true);
            }}
            onComplete={() => setLoading(false)}
          />
          <SelectItem
            label="PDF"
            filename={`${chartTitle}.pdf`}
            getData={() => getSinglePagePdf(chartId, chartTitle)}
            onClick={() => {
              setOpen(false);
              setLoading(true);
            }}
            onComplete={() => setLoading(false)}
          />
          <div>Email</div>
          <div>Link</div>
          <div>Excel</div>

          <h3>Export Data</h3>
          <SelectItem
            label="CSV"
            filename={`${chartTitle}.csv`}
            getData={() => getCsv(exportData())}
            onClick={() => setOpen(false)}
          />
          <div>Excel</div>

        </div>
      )}
    </span>
  );
};

export default ChartExportSelect;

ChartExportSelect.propTypes = {
  chartId: PropTypes.string,
  chartTitle: PropTypes.string,
  exportData: PropTypes.func,
  style: PropTypes.shape({}),
};

ChartExportSelect.defaultProps = {
  chartId: undefined,
  chartTitle: undefined,
  exportData: () => null,
  style: undefined,
};
