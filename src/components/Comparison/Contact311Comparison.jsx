import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { REQUEST_SOURCES, DISTRICT_TYPES } from '@components/common/CONSTANTS';
import ChartExportSelect from '@components/export/ChartExportSelect';
import PieChart from '@components/Chart/PieChart';
import { transformCounts } from '@utils';

const Contact311Comparison = ({
  counts: { set1, set2 },
}) => {
  const setName = district => (
    DISTRICT_TYPES
      .find(t => t.id === district)?.name
      .replace(' District', '')
  );

  const setSectors = counts => (
    Object.keys(counts)
      .map(key => ({
        label: key,
        value: counts[key],
        color: REQUEST_SOURCES.find(s => s.type === key)?.color,
      }))
  );

  const set1name = setName(set1.district);
  const set2name = setName(set2.district);

  const set1counts = transformCounts(set1.source);
  const set2counts = transformCounts(set2.source);

  const exportData = () => {
    const set1keys = Object.keys(set1counts);
    const set2keys = Object.keys(set2counts);

    const set1total = Object.values(set1counts).reduce((p, c) => p + c, 0);
    const set2total = Object.values(set2counts).reduce((p, c) => p + c, 0);

    const header = [
      set1name,
      `${set1name} (%)`,
      set2name,
      `${set2name} (%)`,
    ];

    const index = [...new Set([...set1keys, ...set2keys])];

    const rows = index.map(sourceType => [
      set1counts[sourceType] || 0,
      ((set1counts[sourceType] || 0) * (100 / set1total)).toFixed(2),
      set2counts[sourceType] || 0,
      ((set2counts[sourceType] || 0) * (100 / set2total)).toFixed(2),
    ]);

    return {
      header,
      rows,
      index,
    };
  };

  return (
    <div className="contact-311-comparison">
      <h1>How People Contact 311</h1>
      <ChartExportSelect
        componentName="Contact311Comparison"
        pdfTemplateName="ComparisonPageNoLegend"
        exportData={exportData}
        filename="How People Contact 311"
      />
      <div className="chart-container">
        <PieChart
          sectors={setSectors(set1counts)}
          addLabels
          exportable={false}
        />
        <h2>{ set1name }</h2>
      </div>
      <div className="chart-container">
        <PieChart
          sectors={setSectors(set2counts)}
          addLabels
          exportable={false}
        />
        <h2>{ set2name }</h2>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  counts: state.comparisonData.counts,
});

export default connect(mapStateToProps)(Contact311Comparison);

Contact311Comparison.propTypes = {
  counts: PropTypes.shape({
    set1: PropTypes.shape({
      district: PropTypes.string,
      source: PropTypes.shape({}),
    }),
    set2: PropTypes.shape({
      district: PropTypes.string,
      source: PropTypes.shape({}),
    }),
  }),
};

Contact311Comparison.defaultProps = {
  counts: {
    set1: {},
    set2: {},
  },
};
