import { createMuiTheme } from "@material-ui/core/styles";
import {
  colorPrimaryFocus,
  colorPrimaryDark,
  colorTextSecondaryDark,
  colorSecondaryFocus,
  colorTextSecondaryLight,
} from "./colors";
import gaps from "./gaps";
import borderRadius from "./borderRadius";

const theme = createMuiTheme({
  gaps,
  borderRadius,
  palette: {
    type: "dark",
    primary: {
      main: colorPrimaryDark,
      dark: "#192730",
      focus: colorPrimaryFocus,
    },
    selected: { primary: " rgba(129, 123, 123, 0.3)" },
    secondary: {
      main: colorTextSecondaryDark,
    },
    background: {
      default: "#1A1A1A",
    },
    text: {
      dark: "#C4C4C4",
      cyan: colorSecondaryFocus,
      secondaryDark: colorTextSecondaryDark,
      secondaryLight: colorTextSecondaryLight,
    },
  },
  header: {
    height: "62px",
  },
  footer: {
    height: "40px",
  },
  typography: {
    fontFamily: ["Oswald", "sans-serif"],
  },
});

export default theme;
