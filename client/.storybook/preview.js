import React from "react";
import theme from '../theme/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import map from "./assets/map.jpg"
import colors from "../theme/colors"

export const decorators = [
  (Story) => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
  ),
];

export const parameters = {
  backgrounds: {
    values: [
      { name: "main", value: colors.colorPrimaryDark },
      { name: "white", value: colors.colorTextPrimaryLight },
      { name: "dark", value: colors.colorSecondaryDark },
    ],
  },
};