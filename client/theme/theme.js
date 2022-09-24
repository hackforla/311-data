import {
  createMuiTheme,
} from '@material-ui/core/styles';
import colors from '@theme/colors';
import gaps from '@theme/gaps';
import borderRadius from '@theme/borderRadius';
import typography from '@theme/typography';

const isLightTheme = true;

const commonThemeItems = {
  gaps,
  borderRadius,
  typography,
  header: {
    height: '62px',
  },
  footer: {
    height: '40px',
  },
};

const lightTheme = createMuiTheme({
  ...commonThemeItems,
  palette: {
    type: 'light',
    selected: { primary: 'rgba(129, 123, 123, 0.3)' },
    primary: {
      main: '#002449',
    },
    secondary: {
      main: '#ffb100',
    },
    text: {
      primary: '#002449',
    },
  },
});

const darkTheme = createMuiTheme({
  ...commonThemeItems,
  palette: {
    type: 'dark',
    primary: {
      main: colors.primaryDark,
      dark: '#192730',
      focus: colors.primaryFocus,
    },
    selected: { primary: 'rgba(129, 123, 123, 0.3)' },
    secondary: {
      main: colors.textSecondaryDark,
      light: colors.textSecondaryLight,
    },
    background: {
      default: '#0F181F',
    },
    text: {
      dark: '#C4C4C4',
      cyan: colors.secondaryFocus,
      primaryDark: colors.textPrimaryDark,
      secondaryDark: colors.textSecondaryDark,
      secondaryLight: colors.textSecondaryLight,
    },
  },
});

const theme = isLightTheme ? lightTheme : darkTheme;

export {
  lightTheme,
  darkTheme,
  theme as default,
};
