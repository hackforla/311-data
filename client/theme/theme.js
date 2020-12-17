import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#2A404E',
      dark: '#192730',
    },
    secondary: {
      main: '#0F181F',
    },
    background: {
      default: '#1A1A1A',
    },
    typography: {
      fontFamily: ['Oswald', 'sans-serif'],
      dark: '#C4C4C4',
    },
    header: {
      height: '62px',
    },
    footer: {
      height: '40px',
    },
  },
});

export default theme;
