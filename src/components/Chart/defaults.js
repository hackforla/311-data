import COLORS from '@styles/COLORS';

// override ChartJS defaults
export default {
  global: {
    defaultFontColor: COLORS.FONTS,
    defaultFontFamily: 'Roboto, sans-serif',
    animation: false,
    title: {
      display: false,
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
};
