import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { REQUEST_SOURCES, DISTRICT_TYPES } from '@components/common/CONSTANTS';
import ChartExportSelect from '@components/export/ChartExportSelect';
import { PieChart } from '@components/Chart';
import InfoTitle from '@components/common/InfoTitle';
import { transformCounts } from '@utils';

const Contact311Comparison = ({
  counts: { set1, set2 },
  set1list,
  set2list,
}) => {
  const setName = district => (
    DISTRICT_TYPES
      .find(t => t.id === district)?.name
      .replace(' District', '')
  );

  const setSectors = counts => (
    Object.keys(counts)
      .map(key => {
        const source = REQUEST_SOURCES.find(s => s.type === key);
        return {
          label: key,
          value: counts[key],
          color: source?.color,
          abbrev: source?.abbrev,
        };
      })
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

  const ariaLabelGenerator = set => {
    const labelDataSet = {};
    let ariaLabel = '';

    if (set === 1) {
      labelDataSet.name = set1list;
      labelDataSet.label = setSectors(set1counts);
    } else {
      labelDataSet.name = set2list;
      labelDataSet.label = setSectors(set2counts);
    }

    let totalVal = 0;
    const { name, label } = labelDataSet;
    label.forEach(item => {
      totalVal += item.value;
    });

    let count = 0;
    const max = label.length;

    let setNames = '';
    name.forEach(n => {
      // eslint-disable-next-line no-unused-expressions
      setNames === ''
        ? setNames += ` ${n}`
        : setNames += `, ${n}`;
    });

    while (count < max) {
      const percent = ((label[count].value / totalVal) * 100).toFixed(1);
      // eslint-disable-next-line no-unused-expressions
      (ariaLabel === '')
        ? ariaLabel = `This pie chart looks at how people contacted Neighborhood Council Set ${set} :${setNames}. ${label[count].label}: ${percent}% of contact methods.`
        : ariaLabel += ` ${label[count].label}: ${percent}% of contact methods.`;
      count += 1;
    }

    return ariaLabel;
  };

  const setOneAriaLabelString = ariaLabelGenerator(1);
  const setTwoAriaLabelString = ariaLabelGenerator(2);

  return (
    <div className="contact-311-comparison">
      <InfoTitle
        title="How People Contact 311"
        infoText="This chart displays the relative frequency of methods people use to contact 311 in each district set."
      />
      <ChartExportSelect
        componentName="Contact311Comparison"
        pdfTemplateName="ComparisonPageNoLegend"
        exportData={exportData}
        filename="How People Contact 311"
      />
      <div className="columns is-gapless">
        <div className="chart-container column">
          <PieChart
            sectors={setSectors(set1counts)}
            addLabels
            exportable={false}
            ariaLabelString={setOneAriaLabelString}
          />
          <h2>{`${set1name}${set1list.length > 1 ? 's' : ''} (Set 1):`}</h2>
          <p className="set-list">{ set1list.join(', ')}</p>
        </div>
        <div className="chart-container column">
          <PieChart
            sectors={setSectors(set2counts)}
            addLabels
            exportable={false}
            ariaLabelString={setTwoAriaLabelString}
          />
          <h2>{`${set2name}${set2list.length > 1 ? 's' : ''} (Set 2):`}</h2>
          <p className="set-list">{ set2list.join(', ') }</p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  counts: state.comparisonData.counts,
  set1list: state.comparisonFilters.comparison.set1.list,
  set2list: state.comparisonFilters.comparison.set2.list,
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
  set1list: PropTypes.arrayOf(PropTypes.string).isRequired,
  set2list: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Contact311Comparison.defaultProps = {
  counts: {
    set1: {},
    set2: {},
  },
};
