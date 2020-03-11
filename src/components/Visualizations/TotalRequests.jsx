import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import Chart from './Chart';

const TotalRequests = ({
  requestTypes,
}) => {
  // // DATA ////

  const randomSeries = (count, min, max) => Array.from({ length: count })
    .map(() => Math.round(Math.random() * (max - min) + min));

  const dummyData = REQUEST_TYPES.reduce((p, c) => {
    const acc = p;
    acc[c.type] = randomSeries(12, 20, 200);
    return acc;
  }, {});

  const selectedTypes = REQUEST_TYPES.filter(el => requestTypes[el.type]);

  const chartData = {
    labels: [
      'January', 'February', 'March',
      'April', 'May', 'June',
      'July', 'August', 'September',
      'October', 'November', 'December',
    ],
    datasets: selectedTypes.map(t => ({
      label: t.abbrev,
      backgroundColor: t.color,
      data: dummyData[t.type],
    })),
  };

  // // OPTIONS ////

  const chartOptions = {
    aspectRatio: 611 / 400,
    title: {
      text: 'Total Requests',
    },
    scales: {
      xAxes: [{
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: 'Timeline',
        },
        ticks: {
          minRotation: 45,
          maxRotation: 45,
        },
      }],
      yAxes: [{
        stacked: true,
        scaleLabel: {
          labelString: '# of Requests',
        },
        ticks: {
          beginAtZero: true,
        },
      }],
    },
    tooltips: {
      mode: 'index',
      callbacks: {
        footer: (tooltipItem, data) => {
          const { index } = tooltipItem[0];
          const total = data.datasets.reduce((p, c) => p + c.data[index], 0);
          return `Total ${total}`;
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
      className="total-requests"
    />
  );
};

const mapStateToProps = state => ({
  requestTypes: state.data.requestTypes,
});

export default connect(mapStateToProps)(TotalRequests);

TotalRequests.propTypes = {
  requestTypes: PropTypes.shape({}).isRequired,
};
