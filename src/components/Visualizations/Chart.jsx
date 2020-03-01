import React from 'react';
import PropTypes from 'proptypes';
import Chart from 'chart.js';
import 'chartjs-chart-box-and-violin-plot';
import COLORS from '@styles/COLORS';

// ///////// CHARTJS DEFAULTS ///////////

Object.assign(Chart.defaults.global, {
  defaultFontColor: COLORS.FONTS,
  defaultFontFamily: 'Roboto',
  animation: false,
  responsive: true,
  maintainAspectRatio: false,
  legend: false
});

Object.assign(Chart.defaults.global.title, {
  display: true,
  fontFamily: 'Open Sans',
  fontSize: 20,
});

Object.assign(Chart.defaults.scale.scaleLabel, {
  display: true,
  fontFamily: 'Open Sans',
  fontWeight: 'bold',
  fontSize: 15,
});

Object.assign(Chart.defaults.global.tooltips, {
  xPadding: 10,
  yPadding: 10,
  bodyFontFamily: 'Roboto',
  bodyFontSize: 14,
  bodyFontColor: COLORS.FONTS,
  backgroundColor: 'rgb(200, 200, 200)',
  cornerRadius: 4,
});

// //////////// COMPONENT //////////////

class ReactChart extends React.Component {
  canvasRef = React.createRef();

  componentDidMount() {
    const { type, data, options } = this.props;
    const ctx = this.canvasRef.current.getContext('2d');
    this.chart = new Chart(ctx, {
      type,
      data,
      options,
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
  data: PropTypes.shape.isRequired,
  options: PropTypes.shape.isRequired,
  height: PropTypes.func,
};

ReactChart.defaultProps = {
  height: undefined,
};
