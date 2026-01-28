import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { setupStore } from '../redux/store'
import theme from '@theme/theme'

// https://redux.js.org/usage/writing-tests#setting-up-a-reusable-test-render-function
export function renderWithProviders(ui, extendedRenderOptions = {}) {
  const {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions

  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Provider>
  )

  // Return an object with the store and all of RTL's query functions
  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions })
  }
}