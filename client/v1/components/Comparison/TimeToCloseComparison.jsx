import React from 'react';
import PropTypes from 'proptypes';
import { connect } from 'react-redux';
import Chart, { ChartTooltip as Tooltip } from '@components/Chart';
import { COUNCILS, COMPARISON_SETS } from '@components/common/CONSTANTS';
import ChartExportSelect from '@components/export/ChartExportSelect';

const TimeToCloseComparison = ({
  timeToClose,
}) => {
  /* /// DATA /// */

  const boxLabels = {
    nc: id => COUNCILS.find(c => parseInt(id, 10) === c.id).name,
    cc: name => `District ${name}`,
  };

  const getBoxes = setId => {
    const { district, data } = timeToClose[setId];
    return Object.keys(data)
      .filter(name => data[name].count !== 0)
      .map(name => ({
        label: boxLabels[district](name),
        color: COMPARISON_SETS[setId].color,
        stats: { ...data[name], outliers: [] },
      }));
  };

  const boxes = [
    ...getBoxes('set1'),
    ...getBoxes('set2'),
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

  /* /// TOOLTIP /// */

  const tooltip = ttData => {
    const { index } = ttData.dataPoints[0];
    const box = boxes[index];
    const { stats } = box;

    const lines = [{
      text: box.label,
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

  const generateAriaLabelString = () => {
    const { labels, datasets } = chartData;
    const targetData = datasets[0].data;
    let string = '';

    let count = 0;
    const totalDistricts = datasets[0].data.length;
    while (count < totalDistricts) {
      string += (
      `${labels[count]}: ${targetData[count].count} total requests. Minimum time to close was ${(targetData[count].min).toFixed(2)} days. Maximum time to close was ${(targetData[count].max).toFixed(2)} days. 25% were closed in ${(targetData[count].q1).toFixed(2)} days. 50% were closed in ${(targetData[count].median).toFixed(2)} days. 75% were closed in ${(targetData[count].q3).toFixed(2)} days. 
      `
      );
      count += 1;
    }

    return string;
  };
  const AriaLabelString = generateAriaLabelString();
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
  };

  return (
    <Chart
      title="Time to Close"
      titleInfo="This displays the amount of time it typically takes to close the specified 311 request type(s) in each district set."
      type="horizontalBoxplot"
      data={chartData}
      options={chartOptions}
      height={Math.max(160, 130 + (chartData.labels.length * 40))}
      exportButton={exportButton}
      tooltip={tooltip}
      ariaLabelString={AriaLabelString}
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
