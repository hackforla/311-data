import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import Chart from './Chart';

const TimeToCloseComparison = ({
  timeToClose: { NCs, CDs },
}) => {
  // // DATA ////

  const ncBoxes = Object.keys(NCs).map(nc => ({
    label: nc,
    color: '#DDEC9F',
    stats: { ...NCs[nc], outliers: [] },
  }));

  const cdBoxes = Object.keys(CDs).map(cd => ({
    label: `District ${cd}`,
    color: '#565656',
    stats: { ...CDs[cd], outliers: [] },
  }));

  const boxes = [...ncBoxes, ...cdBoxes];

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
  timeToClose: state.data.timeToCloseComparison,
});

export default connect(mapStateToProps)(TimeToCloseComparison);

TimeToCloseComparison.propTypes = {
  timeToClose: PropTypes.shape({
    NCs: PropTypes.shape({}),
    CDs: PropTypes.shape({}),
  }).isRequired,
};
