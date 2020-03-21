import React from 'react';
import PropTypes from 'proptypes';
import ChartJS from 'chart.js';
import 'chartjs-chart-box-and-violin-plot';
import ChartJSDataLabels from 'chartjs-plugin-datalabels';
import clx from 'classnames';
import COLORS from '@styles/COLORS';
import ChartExportSelect from '@components/export/ChartExportSelect';

// ///////// CHARTJS DEFAULTS ///////////

ChartJS.helpers.merge(ChartJS.defaults, {
  global: {
    defaultFontColor: COLORS.FONTS,
    defaultFontFamily: 'Roboto, sans-serif',
    animation: false,
    title: {
      display: true,
      fontFamily: '"Open Sans", sans-serif',
      fontSize: 20,
      padding: 10,
    },
    legend: {
      display: false,
    },
    tooltips: {
      xPadding: 10,
      yPadding: 10,
      titleFontFamily: '"Open Sans", sans-serif',
      titleFontColor: COLORS.FONTS,
      titleFontSize: 14,
      titleFontWeight: 'bold',
      bodyFontFamily: 'Roboto, sans-serif',
      bodyFontSize: 14,
      bodyFontColor: COLORS.FONTS,
      footerFontFamily: 'Roboto, sans-serif',
      footerFontSize: 14,
      footerFontColor: COLORS.FONTS,
      footerFontWeight: 'bold',
      backgroundColor: '#C4C4C4',
      cornerRadius: 4,
    },
    plugins: {
      datalabels: {
        color: COLORS.FONTS,
        font: {
          size: 14,
        },
      },
      chartArea: {
        chartBgColor: COLORS.BACKGROUND,
        pieBorderColor: COLORS.FORMS.STROKE,
      },
    },
  },
  scale: {
    scaleLabel: {
      display: true,
      fontFamily: '"Open Sans", sans-serif',
      fontSize: 14,
    },
  },
});

// ///////// CHARTJS PLUGINS ///////////

// add background color to charts
// https://stackoverflow.com/questions/37144031/background-colour-of-line-charts-in-chart-js?rq=1
ChartJS.pluginService.register({
  beforeDraw: chart => {
    const { chartArea: config } = chart.config.options.plugins;
    if (!config) return;

    const { chartBgColor, pieBorderColor, pieTitleHeight } = config;
    const { ctx } = chart.chart;
    const { chartArea } = chart;
    const { padding } = chart.config.options.layout;
    const pad = typeof padding === 'number' ? {
      top: padding,
      bottom: padding,
      left: padding,
      right: padding,
    } : padding;

    ctx.save();

    const left = chartArea.left - pad.left;
    const top = chartArea.top - pad.top;
    const right = chartArea.right - chartArea.left + pad.left + pad.right;
    const bottom = chartArea.bottom - chartArea.top + pad.top + pad.bottom;

    if (chart.config.type === 'pie') {
      // create border
      ctx.fillStyle = pieBorderColor;
      ctx.fillRect(
        left,
        top - pieTitleHeight,
        right,
        bottom + pieTitleHeight,
      );

      // fill interior
      ctx.fillStyle = chartBgColor;
      const thickness = 1;
      ctx.fillRect(
        left + thickness,
        top - pieTitleHeight + thickness,
        right - 2 * thickness,
        bottom + pieTitleHeight - 2 * thickness,
      );
    } else {
      // fill interior
      ctx.fillStyle = chartBgColor;
      ctx.fillRect(left, top, right, bottom);
    }

    ctx.restore();
  },
});

// opt-in only
ChartJS.plugins.unregister(ChartJSDataLabels);

// //////////// COMPONENT //////////////

class Chart extends React.Component {
  canvasRef = React.createRef();

  componentDidMount() {
    const {
      type,
      data,
      options,
      datalabels,
    } = this.props;

    const ctx = this.canvasRef.current.getContext('2d');
    this.chart = new ChartJS(ctx, {
      type,
      data,
      options,
      plugins: datalabels ? [ChartJSDataLabels] : [],
    });
  }

  componentDidUpdate(prevProps) {
    const { data, options } = this.props;

    if (prevProps.data !== data || prevProps.options !== options) {
      this.chart.data = data;
      this.chart.options = options;
      this.chart.update();
    }
  }

  render() {
    const {
      id,
      exportable,
      height,
      exportData,
      options,
    } = this.props;

    const canvasWrapStyle = {
      position: 'relative',
      height: typeof height === 'undefined'
        ? undefined
        : `${height}px`,
    };

    return (
      <div className={clx('chart', id)}>
        { exportable && (
          <ChartExportSelect
            chartId={id}
            chartTitle={options.title?.text}
            exportData={exportData}
          />
        )}
        <div style={canvasWrapStyle}>
          <canvas ref={this.canvasRef} />
        </div>
      </div>
    );
  }
}

export default Chart;

Chart.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired,
  options: PropTypes.shape({
    title: PropTypes.shape({}),
  }).isRequired,
  height: PropTypes.number,
  datalabels: PropTypes.bool,
  exportable: PropTypes.bool,
  exportData: PropTypes.func,
};

Chart.defaultProps = {
  height: undefined,
  datalabels: false,
  exportable: true,
  exportData: () => null,
};
