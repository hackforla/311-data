import { createMuiTheme } from '@material-ui/core/styles';
import { colorPrimaryFocus } from './colors';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#29404F',
      dark: '#192730',
      focus: colorPrimaryFocus,
    },
    secondary: {
      main: '#0F181F',
    },
    background: {
      default: '#1A1A1A',
    },
    text: {
      dark: '#C4C4C4',
      cyan: '#87C8BC',
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
