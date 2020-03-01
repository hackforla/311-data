import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import Chart from './Chart';

const Contact311 = ({
  requestTypes,
}) => {
  // // DATA ////

  const randomInt = () => {
    const min = 10;
    const max = 100;
    return Math.round(Math.random() * (max - min) + min);
  };

  const dummyData = [{
    label: 'Mobile App',
    color: '#1D66F2',
    value: randomInt(),
  }, {
    label: 'Call',
    color: '#D8E5FF',
    value: randomInt(),
  }, {
    label: 'Email',
    color: '#708ABD',
    value: randomInt(),
  }, {
    label: 'Driver Self Report',
    color: '#C4C6C9',
    value: randomInt(),
  }, {
    label: 'Self Service',
    color: '#0C2A64',
    value: randomInt(),
  }, {
    label: 'Other',
    color: '#6A98F1',
    value: randomInt(),
  }];

  const total = dummyData.reduce((p, c) => p + c.value, 0);

  const chartData = {
    labels: dummyData.map(el => el.label),
    datasets: [{
      data: dummyData.map(el => el.value),
      backgroundColor: dummyData.map(el => el.color),
      datalabels: {
        labels: {
          index: {
            align: 'end',
            anchor: 'end',
            formatter: (value, ctx) => {
              const { label } = dummyData[ctx.dataIndex];
              const percentage = (100 * (value / total)).toFixed(1);
              return `${label}\n${percentage}%`;
            },
            offset: 12,
          },
        },
      },
    }],
  };

  // // OPTIONS ////

  const chartOptions = {
    aspectRatio: 0.8,
    animation: false,
    layout: {
      padding: {
        top: 5,
        bottom: 50,
        left: 0,
        right: 0,
      },
    },
  };

  if (Object.values(requestTypes).every(el => !el)) return null;

  return (
    <div className="type-of-request">
      <h1 className="has-text-centered">
        How People Contact 311
      </h1>
      <Chart
        type="pie"
        data={chartData}
        options={chartOptions}
        datalabels
      />
    </div>
  );
};

const mapStateToProps = state => ({
  requestTypes: state.data.requestTypes,
});

export default connect(mapStateToProps)(Contact311);

Contact311.propTypes = {
  requestTypes: PropTypes.shape({}).isRequired,
};
