import { createMuiTheme } from '@material-ui/core/styles';
import {
  colorPrimaryFocus,
  colorPrimaryDark,
  colorTextSecondaryDark,
  colorTextSecondaryLight,
  colorSecondaryFocus,
} from './colors';
import gaps from './gaps';
import borderRadius from './borderRadius';

const theme = createMuiTheme({
  gaps,
  borderRadius,
  palette: {
    type: 'dark',
    primary: {
      main: colorPrimaryDark,
      dark: '#192730',
      focus: colorPrimaryFocus,
    },
    secondary: {
      main: colorTextSecondaryDark,
      light: colorTextSecondaryLight,
    },
    background: {
      default: '#1A1A1A',
    },
    text: {
      dark: '#C4C4C4',
      cyan: colorSecondaryFocus,
    },
  },
  header: {
    height: '62px',
  },
  footer: {
    height: '40px',
  },
  typography: {
    fontFamily: ['Oswald', 'sans-serif'],
    b2: '14px Roboto',
  },
  // breakpoints: {
  //   values: {
  //     mobile: 375,
  //     tablet: 640,
  //     desktop: 1024,
  //   },
  // },
});

export default theme;
