import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import moment from 'moment';
import Chart from './Chart';

const Frequency = ({
  requestTypes,
}) => {
  // // DATA ////

  const randomPoints = (count, min, max) => Array.from({ length: count })
    .map((el, idx) => ({
      x: moment().add(idx, 'd'),
      y: Math.round(Math.random() * (max - min) + min),
    }));

  const dummyData = REQUEST_TYPES.reduce((p, c) => {
    const acc = p;
    acc[c.type] = randomPoints(10, 20, 200);
    return acc;
  }, {});

  const selectedTypes = REQUEST_TYPES.filter(el => requestTypes[el.type]);

  const chartData = {
    datasets: selectedTypes.map(t => ({
      label: t.abbrev,
      backgroundColor: t.color,
      borderColor: t.color,
      fill: false,
      lineTension: 0,
      data: dummyData[t.type],
    })),
  };

  const exportData = () => ({
    header: chartData.datasets[0].data.map(d => d.x.format('MM/DD/YYYY')),
    rows: chartData.datasets.map(dataset => dataset.data.map(d => d.y)),
    index: chartData.datasets.map(dataset => dataset.label),
  });

  // // OPTIONS ////

  const chartOptions = {
    title: {
      text: 'Frequency',
    },
    aspectRatio: 11 / 8,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'day',
          round: 'day',
        },
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
        title: () => null,
      },
    },
  };

  return (
    <Chart
      id="frequency"
      type="line"
      data={chartData}
      options={chartOptions}
      exportData={exportData}
    />
  );
};

const mapStateToProps = state => ({
  requestTypes: state.filters.requestTypes,
});

export default connect(mapStateToProps)(Frequency);

Frequency.propTypes = {
  requestTypes: PropTypes.shape({}).isRequired,
};
