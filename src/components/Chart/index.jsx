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

    const { chartBgColor } = config;
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

    ctx.fillStyle = chartBgColor;
    ctx.fillRect(left, top, right, bottom);

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
    this.state = { rightEdge: null };
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
    this.setRightEdge();
  }

  componentDidUpdate(prevProps) {
    const { data, options } = this.props;

    if (prevProps.data !== data || prevProps.options !== options) {
      this.chart.data = data;
      this.chart.options = options;
      this.chart.update();
      this.setRightEdge();
    }
  }

  // calculate right edge of chart area so export select
  // can be placed correctly
  setRightEdge = () => {
    const { width, chartArea, config } = this.chart;
    const { layout } = config.options;

    let paddingRight = 0;
    if (layout) {
      paddingRight = typeof layout.padding === 'number'
        ? layout.padding
        : layout.padding?.right || 0;
    }

    this.setState({
      rightEdge: width - chartArea.right - paddingRight,
    });
  }

  render() {
    const {
      id,
      exportable,
      height,
      exportData,
      options,
      title,
    } = this.props;

    const { rightEdge } = this.state;

    const canvasWrapStyle = {
      position: 'relative',
      height: typeof height === 'undefined'
        ? undefined
        : `${height}px`,
    };

    return (
      <div className={clx('chart', id)}>
        { title && <h1>{ title }</h1> }
        <div style={canvasWrapStyle}>
          { exportable && (
            <ChartExportSelect
              chartId={id}
              chartTitle={title || options.title?.text}
              exportData={exportData}
              style={{ right: rightEdge }}
            />
          )}
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
  height: PropTypes.number,
  datalabels: PropTypes.bool,
  exportable: PropTypes.bool,
  exportData: PropTypes.func,

  // NOTE: the title can come in either through the chart options or
  // a prop. If options, the title is on the chart canvas, which means
  // the export is much quicker. If props, the title is an HTML element.
  options: PropTypes.shape({
    title: PropTypes.shape({}),
  }).isRequired,
  title: PropTypes.string,
};

Chart.defaultProps = {
  height: undefined,
  datalabels: false,
  exportable: true,
  exportData: () => null,
  title: undefined,
};
