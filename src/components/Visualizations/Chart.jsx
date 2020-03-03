import React from 'react';
import PropTypes from 'proptypes';
import ChartJS from 'chart.js';
import 'chartjs-chart-box-and-violin-plot';
import ChartJSDataLabels from 'chartjs-plugin-datalabels';
import clx from 'classnames';
import COLORS from '@styles/COLORS';
import { DynamicTooltip } from '@components/common/Tooltip';
import ExportButton from './ExportButton';

// ///////// CHARTJS DEFAULTS ///////////

ChartJS.helpers.merge(ChartJS.defaults, {
  global: {
    defaultFontColor: COLORS.FONTS,
    defaultFontFamily: 'Roboto',
    animation: false,
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
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
        backgroundColor: COLORS.BACKGROUND,
      },
    },
  },
  scale: {
    scaleLabel: {
      display: true,
      fontFamily: 'Open Sans',
      fontSize: 14,
    },
  },
});

// ///////// CHARTJS PLUGINS ///////////

// add background color to charts
// https://stackoverflow.com/questions/37144031/background-colour-of-line-charts-in-chart-js?rq=1
ChartJS.pluginService.register({
  beforeDraw: chart => {
    const bgColor = chart.config.options.plugins.chartArea?.backgroundColor;
    if (!bgColor) return;

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
    ctx.fillStyle = bgColor;
    ctx.fillRect(
      chartArea.left - pad.left,
      chartArea.top - pad.top,
      chartArea.right - chartArea.left + pad.left + pad.right,
      chartArea.bottom - chartArea.top + pad.top + pad.bottom,
    );
    ctx.restore();
  },
});

// opt-in only
ChartJS.plugins.unregister(ChartJSDataLabels);

// //////////// COMPONENT //////////////

class Chart extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.tooltipRef = React.createRef();
  }

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

    this.chart.tooltipRef = this.tooltipRef.current;
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;

    if (prevProps.data !== data) {
      this.chart.data = data;
      this.chart.update();
    }
  }

  render() {
    const {
      title,
      exportable,
      height,
      className,
    } = this.props;

    const canvasWrapStyle = {
      position: 'relative',
      height: typeof height === 'undefined'
        ? undefined
        : `${height}px`,
    };

    return (
      <div className={clx('chart', className)}>
        { title && <h1>{ title }</h1> }
        { exportable && <ExportButton /> }
        <div style={canvasWrapStyle}>
          <canvas ref={this.canvasRef} />
          <DynamicTooltip ref={this.tooltipRef} />
        </div>
      </div>
    );
  }
}

export default Chart;

Chart.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.shape({}).isRequired,
  options: PropTypes.shape({}).isRequired,
  title: PropTypes.string,
  height: PropTypes.number,
  datalabels: PropTypes.bool,
  exportable: PropTypes.bool,
  className: PropTypes.string,
};

Chart.defaultProps = {
  title: null,
  height: undefined,
  datalabels: false,
  exportable: true,
  className: undefined,
};
