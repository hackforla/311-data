import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import moment from 'moment';
import { DISTRICT_TYPES } from '@components/common/CONSTANTS';
import Chart from '@components/Chart';
import ChartExportSelect from '@components/export/ChartExportSelect';

const TotalRequestsComparison = ({
  bins,
  set1,
  set2,
}) => {
  /* /// DATA /// */

  const getDataSet = set => {
    const { district, counts } = set;

    const totals = Array.from({ length: bins.length - 1 }).map((_, idx) => (
      Object.keys(counts).reduce((acc, name) => (
        acc + counts[name][idx]
      ), 0)
    ));

    const color = DISTRICT_TYPES.find(t => t.id === district)?.color;
    const label = DISTRICT_TYPES.find(t => t.id === district)?.name;

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
      getDataSet(set1),
      getDataSet(set2),
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
      componentName="TotalRequestsComparison"
      pdfTemplateName="ComparisonPage"
      exportData={exportData}
      filename="Total Requests"
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

  return (
    <Chart
      title="Total Requests"
      type="bar"
      data={chartData}
      options={chartOptions}
      exportButton={exportButton}
    />
  );
};

const mapStateToProps = state => ({
  bins: state.comparisonData.frequency.bins,
  set1: state.comparisonData.frequency.set1,
  set2: state.comparisonData.frequency.set2,
});

export default connect(mapStateToProps)(TotalRequestsComparison);

TotalRequestsComparison.propTypes = {
  bins: PropTypes.arrayOf(PropTypes.string).isRequired,
  set1: PropTypes.shape({
    district: PropTypes.string,
    counts: PropTypes.shape({}).isRequired,
  }).isRequired,
  set2: PropTypes.shape({
    district: PropTypes.string,
    counts: PropTypes.shape({}).isRequired,
  }).isRequired,
};
