import React from 'react';
import {
  Routes, Route, Navigate, useLocation,
} from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import queryString from 'query-string';
import theme, { darkTheme } from '@theme/theme';
import Desktop from '@components/main/Desktop';
// import DashboardOverview from '@dashboards/DashboardOverview';
// import DashboardComparison from '@dashboards/DashboardComparison';
import Privacy from '@components/main/Privacy';
import Faqs from '@components/main/Faqs';
import About from '@components/main/About';
// import Research from '@components/main/Research';
import Contact from '@components/contact/Contact';
import ContentBottom from '@components/common/ContentBottom';

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

      {/* Default theme - Everything else. */}
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Paper elevation={0}>
            <Routes>
              {/* <Route path="/dashboard-overview" element={<DashboardOverview />} />
              <Route
                path="/dashboard-comparison"
                element={<DashboardComparison />}
              /> */}
              {/* <Route path="/privacy" element={<Privacy />} /> */}
              <Route path="/faqs" element={<Faqs />} />
              {/* <Route path="/research" element={<Research />} /> */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/" element={<Navigate to={`map${search}`} />} />
            </Routes>
            <ContentBottom />
          </Paper>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
}
