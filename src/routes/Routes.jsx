import React from 'react';
import {
  Routes, Route, Navigate, useLocation,
} from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import queryString from 'query-string';
import theme, { darkTheme } from '@theme/theme';
import Desktop from '@pages/Home/index';
import Faqs from '@pages/FAQ/Faqs';
import About from '@pages/About/About';
import Contact from '@pages/Contact/Contact';
import Privacy from '@pages/Privacy/Privacy';
import ContentBottom from '@components/layout/ContentBottom';

export default function AppRoutes() {
  const { pathname, search } = useLocation();
  const values = queryString.parse(search);

  return (
    <>
      {/* Dark Theme - Map. */}
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={darkTheme}>
          <Paper elevation={0}>
            <Box visibility={pathname !== '/map' ? 'hidden' : 'visible'}>
              <Desktop initialState={values} />
            </Box>
          </Paper>
        </ThemeProvider>
      </StyledEngineProvider>

      {/* /* Default theme - Everything else. */ }
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Paper elevation={0}>
            <Routes>
              <Route path="/faqs" element={<Faqs />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/" element={<Navigate to={`map${search}`} />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
            <ContentBottom />
          </Paper>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
}
