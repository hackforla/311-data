import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import Chart from '@components/Chart';

const TimeToCloseComparison = ({
  timeToClose: { set1, set2 },
}) => {
  // // DATA ////

  const boxColors = {
    nc: '#DDEC9F',
    cc: '#565656',
  };

  const boxLabels = {
    nc: name => name,
    cc: name => `District ${name}`,
  };

  const getBoxes = ({ district, data }) => (
    Object.keys(data).map(name => ({
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

  // // OPTIONS ////

  const chartOptions = {
    title: {
      text: 'Time to Close',
    },
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
      id="time-to-close-comparison"
      type="horizontalBoxplot"
      data={chartData}
      options={chartOptions}
      height={Math.max(160, 130 + (chartData.labels.length * 40))}
      exportData={exportData}
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
