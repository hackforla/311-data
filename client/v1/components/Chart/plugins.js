export default {};

// add background color to charts
// https://stackoverflow.com/questions/37144031/background-colour-of-line-charts-in-chart-js?rq=1
export const chartAreaPlugin = {
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
};
