import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import { REQUEST_TYPES } from '@components/common/CONSTANTS';
import Chart, { ChartTooltip as Tooltip } from '@components/Chart';
import ChartExportSelect from '@components/export/ChartExportSelect';

const TimeToClose = ({
  timeToClose,
}) => {
  /* /// DATA /// */

  const boxes = Object.keys(timeToClose)
    .filter(key => timeToClose[key].count !== 0)
    .map(key => {
      const requestType = REQUEST_TYPES[key];
      return {
        abbrev: requestType?.abbrev,
        color: requestType?.color,
        stats: {
          ...timeToClose[key],
          outliers: [],
        },
      };
    });

  const chartData = {
    labels: boxes.map(b => b.abbrev),
    datasets: [{
      data: boxes.map(b => b.stats),
      backgroundColor: boxes.map(b => b.color),
      borderColor: '#000',
      borderWidth: 1,
      outlierColor: '#000',
    }],
  };

  if (boxes.length === 0) chartData.labels = [''];

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
      componentName="TimeToClose"
      pdfTemplateName="VisPage"
      exportData={exportData}
      filename="Time to Close"
    />
  );

  /* /// TOOLTIP /// */

  const tooltip = ttData => {
    const { index } = ttData.dataPoints[0];
    const box = boxes[index];
    const { stats } = box;

    const lines = [{
      text: box.abbrev,
      bold: true,
      color: box.color,
    }, {
      text: `min: ${stats.min.toFixed(2)} days`,
    }, {
      text: `25%: ${stats.q1.toFixed(2)} days`,
    }, {
      text: `50%: ${stats.median.toFixed(2)} days`,
    }, {
      text: `75%: ${stats.q3.toFixed(2)} days`,
    }, {
      text: `max: ${stats.max.toFixed(2)} days`,
    }, {
      text: `count: ${stats.count} requests`,
    }];

    return <Tooltip lines={lines} />;
  };

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
  };

  return (
    <Chart
      title="Time to Close"
      titleInfo="This displays the amount of time it typically takes to close the specified 311 request type(s)."
      type="horizontalBoxplot"
      data={chartData}
      options={chartOptions}
      height={Math.max(160, 130 + (chartData.labels.length * 40))}
      exportButton={exportButton}
      tooltip={tooltip}
    />
  );
};

const mapStateToProps = state => ({
  timeToClose: state.data.timeToClose,
});

export default connect(mapStateToProps)(TimeToClose);

TimeToClose.propTypes = {
  timeToClose: PropTypes.shape({}).isRequired,
};
