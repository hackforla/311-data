import {
  createMuiTheme,
  responsiveFontSizes,
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

// lightTheme is used by content pages - see Routes.jsx.
const lightTheme = responsiveFontSizes(createMuiTheme({
  ...commonThemeItems,
  palette: {
    type: 'light',
    selected: { primary: colors.selectedPrimary },
    primary: {
      main: colors.primaryLight,
    },
    secondary: {
      main: colors.primaryFocus,
    },
    text: {
      primary: colors.textPrimaryLight,
      dark: colors.textDark,
    },
  },
}));

// darkTheme is used by map page
const darkTheme = responsiveFontSizes(createMuiTheme({
  ...commonThemeItems,
  palette: {
    type: 'dark',
    primary: {
      main: colors.primaryDarkMain,
      dark: colors.primaryDark,
      focus: colors.primaryFocus,
    },
    selected: { primary: colors.selectedPrimary },
    secondary: {
      main: colors.textSecondaryDark,
      light: colors.textSecondaryLight,
    },
    background: {
      default: colors.secondaryDark,
    },
    text: {
      dark: colors.textDark,
      cyan: colors.secondaryFocus,
      primaryDark: colors.textPrimaryDark,
      secondaryDark: colors.textSecondaryDark,
      secondaryLight: colors.textSecondaryLight,
    },
  },
}));

const theme = isLightTheme ? lightTheme : darkTheme;

export {
  lightTheme,
  darkTheme,
  theme as default,
};
