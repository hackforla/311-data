import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import Chart from '@components/Chart';
import { DISTRICT_TYPES } from '@components/common/CONSTANTS';
import ChartExportSelect from '@components/export/ChartExportSelect';

const TimeToCloseComparison = ({
  timeToClose: { set1, set2 },
}) => {
  /* /// DATA /// */

  const boxColors = {
    nc: DISTRICT_TYPES.find(t => t.id === 'nc')?.color,
    cc: DISTRICT_TYPES.find(t => t.id === 'cc')?.color,
  };

  const boxLabels = {
    nc: name => name,
    cc: name => `District ${name}`,
  };

  const getBoxes = ({ district, data }) => (
    Object.keys(data)
      .filter(name => data[name].count !== 0)
      .map(name => ({
        label: boxLabels[district](name),
        color: boxColors[district],
        stats: { ...data[name], outliers: [] },
      }))
  );

  const boxes = [
    ...getBoxes(set1),
    ...getBoxes(set2),
  ];

  const chartData = {
    labels: boxes.map(b => b.label),
    datasets: [{
      data: boxes.map(b => b.stats),
      backgroundColor: boxes.map(b => b.color),
      borderColor: '#000',
      borderWidth: 1,
      outlierColor: '#000',
    }],
  };

  /* /// EXPORT /// */

  const exportData = () => {
    const header = [
      'min', 'q1', 'median', 'q3', 'max',
      'whiskerMin', 'whiskerMax', 'count',
    ];

    return {
      header,
      rows: chartData.datasets[0].data.map(stats => header.map(key => stats[key])),
      index: chartData.labels,
    };
  };

  const exportButton = (
    <ChartExportSelect
      componentName="TimeToCloseComparison"
      pdfTemplateName="ComparisonPage"
      exportData={exportData}
      filename="Time to Close"
    />
  );

  /* /// OPTIONS /// */

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Days',
        },
        ticks: {
          beginAtZero: true,
          maxStats: 'whiskerMax',
        },
      }],
      yAxes: [{
        scaleLabel: {
          labelString: 'Type of Request',
        },
      }],
    },
    tooltips: {
      callbacks: {
        title: () => null,
      },
    },
    tooltipDecimals: 1,
  };

  return (
    <Chart
      title="Time to Close"
      type="horizontalBoxplot"
      data={chartData}
      options={chartOptions}
      height={Math.max(160, 130 + (chartData.labels.length * 40))}
      exportButton={exportButton}
    />
  );
};

const mapStateToProps = state => ({
  timeToClose: state.comparisonData.timeToClose,
});

export default connect(mapStateToProps)(TimeToCloseComparison);

TimeToCloseComparison.propTypes = {
  timeToClose: PropTypes.shape({
    set1: PropTypes.shape({}),
    set2: PropTypes.shape({}),
  }).isRequired,
};
