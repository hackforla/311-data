import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '@root/redux/store';

const AllTheProviders = ({ children }) => (
  <Provider store={store}>
    {children}
  </Provider>
);

/**
 * customerRender overrides the built-in render function so it automatically
 *                connects to the redux store when called. this method will
 *                be utilized mainly in __tests__
 *
 * https://testing-library.com/docs/react-testing-library/setup#custom-render
 */

const customRender = (ui, options) => render(ui, { wrapper: AllTheProviders, ...options });

AllTheProviders.propTypes = {
  children: PropTypes.node.isRequired,
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
