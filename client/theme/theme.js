import { createMuiTheme } from '@material-ui/core/styles';
import {
  colorPrimaryFocus,
  colorPrimaryDark,
  colorTextSecondaryDark,
  colorTextSecondaryLight,
  colorSecondaryFocus,
  colorTextPrimaryDark,
} from './colors';
import gaps from './gaps';
import borderRadius from './borderRadius';
import typography from './typography';

const theme = createMuiTheme({
  gaps,
  borderRadius,
  typography,
  palette: {
    type: 'dark',
    primary: {
      main: colorPrimaryDark,
      dark: '#192730',
      focus: colorPrimaryFocus,
    },
    selected: { primary: 'rgba(129, 123, 123, 0.3)' },
    secondary: {
      main: colorTextSecondaryDark,
      light: colorTextSecondaryLight,
    },
    background: {
      default: '#0F181F',
    },
    text: {
      dark: '#C4C4C4',
      cyan: colorSecondaryFocus,
      primaryDark: colorTextPrimaryDark,
      secondaryDark: colorTextSecondaryDark,
      secondaryLight: colorTextSecondaryLight,
    },
  },
  header: {
    height: '62px',
  },
  footer: {
    height: '40px',
  },
});

export default theme;
