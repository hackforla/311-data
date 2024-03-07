import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import moment from 'moment';
import { DISTRICT_TYPES, COMPARISON_SETS } from '@components/common/CONSTANTS';
import Chart from '@components/Chart';
import ChartExportSelect from '@components/export/ChartExportSelect';

const FrequencyComparison = ({
  bins,
  sets,
}) => {
  /* /// DATA /// */

  const getDataSet = setId => {
    const { district, counts } = sets[setId];

    const totals = Array.from({ length: bins.length - 1 }).map((_, idx) => (
      Object.keys(counts).reduce((acc, name) => (
        acc + counts[name][idx]
      ), 0)
    ));

    const { color, name: setName } = COMPARISON_SETS[setId];
    const label = DISTRICT_TYPES.find(t => t.id === district)?.name
                                .replace(' District', ` (${setName})`);

    return {
      data: totals,
      label,
      backgroundColor: color,
      borderColor: color,
      fill: false,
      lineTension: 0.3,
    };
  };

  const chartData = {
    labels: bins.slice(0, -1).map(bin => moment(bin).format('MMM D')),
    datasets: [
      getDataSet('set1'),
      getDataSet('set2'),
    ],
  };

  /* /// EXPORT /// */

  const exportData = () => ({
    header: bins.slice(0, -1).map(bin => moment(bin).format('MM/DD/YYYY')),
    rows: chartData.datasets.map(dataset => dataset.data),
    index: chartData.datasets.map(dataset => dataset.label),
  });

  const exportButton = (
    <ChartExportSelect
      componentName="FrequencyComparison"
      pdfTemplateName="ComparisonPage"
      exportData={exportData}
      filename="Frequency"
    />
  );

  /* /// OPTIONS /// */

  const chartOptions = {
    aspectRatio: 11 / 8,
    scales: {
      xAxes: [{
        scaleLabel: {
          labelString: 'Timeline',
        },
        ticks: {
          minRotation: 45,
          maxRotation: 45,
        },
      }],
      yAxes: [{
        scaleLabel: {
          labelString: '# of Requests',
        },
        ticks: {
          beginAtZero: true,
        },
      }],
    },
    tooltips: {
      callbacks: {
        title: tt => {
          const { index } = tt[0];
          const start = moment(bins[index]).format('MMM D');
          const end = moment(bins[index + 1]).subtract(1, 'days').format('MMM D');
          return start === end ? start : `${start} - ${end}`;
        },
      },
    },
  };

  const ariaLabelGenerator = () => {
    const { labels, datasets } = chartData;
    const setOneData = datasets[0].data;
    const setTwoData = datasets[1].data;
    const dataLabels = labels;
    let ariaLabel = '';
    let count = 0;

    if (dataLabels.length === 0) {
      return ariaLabel;
    }

    while (count < dataLabels.length) {
      if (ariaLabel === '') {
        ariaLabel = (
        `This table displays datasets comparing request frequencies for selected request types for ${datasets[0].label} and ${datasets[1].label}. Starting ${dataLabels[count]}, there were ${setOneData[count]} for ${datasets[0].label} and ${setTwoData[count]} for ${datasets[1].label}.`
        );
      } else {
        ariaLabel += ` Starting ${dataLabels[count]}, there were ${setOneData[count]} for ${datasets[0].label} and ${setTwoData[count]} for ${datasets[1].label}.`;
      }
      count += 1;
    }

    return ariaLabel;
  };

  const ariaLabelString = ariaLabelGenerator();

  return (
    <Chart
      title="Frequency"
      titleInfo="Frequency displays the number of specific request type(s) over time for each district set."
      type="line"
      data={chartData}
      options={chartOptions}
      exportButton={exportButton}
      ariaLabelString={ariaLabelString}
    />
  );
};

const mapStateToProps = state => ({
  bins: state.comparisonData.frequency.bins,
  sets: {
    set1: state.comparisonData.frequency.set1,
    set2: state.comparisonData.frequency.set2,
  },
});

export default connect(mapStateToProps)(FrequencyComparison);

FrequencyComparison.propTypes = {
  bins: PropTypes.arrayOf(PropTypes.string).isRequired,
  sets: PropTypes.shape({
    set1: PropTypes.shape({
      district: PropTypes.string,
      counts: PropTypes.shape({}),
    }),
    set2: PropTypes.shape({
      district: PropTypes.string,
      counts: PropTypes.shape({}),
    }),
  }).isRequired,
};
