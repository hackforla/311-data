import React from 'react';
import PropTypes from 'proptypes';
import Chart from 'chart.js';
import 'chartjs-chart-box-and-violin-plot';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import COLORS from '@styles/COLORS';

// ///////// CHARTJS DEFAULTS ///////////

Chart.helpers.merge(Chart.defaults, {
  global: {
    defaultFontColor: COLORS.FONTS,
    defaultFontFamily: 'Roboto',
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
    title: {
      display: true,
      fontFamily: 'Open Sans',
      fontSize: 20,
    },
    legend: {
      display: false,
    },
    tooltips: {
      xPadding: 10,
      yPadding: 10,
      titleFontFamily: 'Open Sans',
      titleFontColor: COLORS.FONTS,
      titleFontSize: 14,
      titleFontWeight: 'bold',
      bodyFontFamily: 'Roboto',
      bodyFontSize: 14,
      bodyFontColor: COLORS.FONTS,
      footerFontFamily: 'Roboto',
      footerFontSize: 14,
      footerFontColor: COLORS.FONTS,
      footerFontWeight: 'bold',
      backgroundColor: 'rgb(200, 200, 200)',
      cornerRadius: 4,
    },
    plugins: {
      datalabels: {
        color: COLORS.FONTS,
        font: {
          size: 14,
        },
      },
    },
  },
  scale: {
    scaleLabel: {
      display: true,
      fontFamily: 'Open Sans',
      fontSize: 15,
    },
  },
});

// opt-in only
Chart.plugins.unregister(ChartDataLabels);

// //////////// COMPONENT //////////////

class ReactChart extends React.Component {
  canvasRef = React.createRef();

  componentDidMount() {
    const {
      type,
      data,
      options,
      datalabels,
    } = this.props;

    const ctx = this.canvasRef.current.getContext('2d');
    this.chart = new Chart(ctx, {
      type,
      data,
      options,
      plugins: datalabels ? [ChartDataLabels] : [],
    });
    this.setHeight();
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;

    if (prevProps.data !== data) {
      this.chart.data = data;
      this.chart.update();
      this.setHeight();
    }
  }

  setHeight = () => {
    const { height } = this.props;

    if (height) {
      const numLabels = this.chart.data.labels.length;
      const heightPx = height(numLabels);
      this.canvasRef.current.parentNode.style.height = `${heightPx}px`;
    }
  }

  render() {
    return (
      <div className="is-relative">
        <canvas ref={this.canvasRef} />
      </div>
    );
  }
}

export default ReactChart;

ReactChart.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired,
  options: PropTypes.shape({}).isRequired,
  height: PropTypes.func,
  datalabels: PropTypes.bool,
};

ReactChart.defaultProps = {
  height: undefined,
  datalabels: false,
};
