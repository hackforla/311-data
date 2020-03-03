import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import Chart from './Chart';
import Tooltip, { adapter } from './ChartTooltip';

const Contact311 = () => {
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
            offset: 4,
          },
        },
      },
    }],
  };

  // // OPTIONS ////

  const chartOptions = {
    aspectRatio: 1.0,
    animation: false,
    layout: {
      padding: 65,
    },
    tooltips: {
      custom: adapter(ttData => {
        const [abbrev, value] = ttData.body[0].lines[0].split(': ');
        const lines = [{
          text: abbrev,
          color: ttData.labelColors[0].backgroundColor,
          bold: true,
        }, {
          text: `${value} requests`,
        }];
        return <Tooltip lines={lines} />;
      }),
    },
  };

  return (
    <Chart
      title="How People Contact 311"
      type="pie"
      data={chartData}
      options={chartOptions}
      datalabels
      className="contact-311"
    />
  );
};

const mapStateToProps = state => ({
  requestTypes: state.data.requestTypes,
});

export default connect(mapStateToProps)(Contact311);

Contact311.propTypes = {
  requestTypes: PropTypes.shape({}).isRequired,
};
