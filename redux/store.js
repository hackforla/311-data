import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import { composeWithDevToolsDevelopmentOnly } from '@redux-devtools/extension';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

if (import.meta.env.DEV) {
  const logger = createLogger({
    collapsed: (getState, action, logEntry) => !logEntry.error,
  });
  middlewares.push(logger);
}

export function setupStore(preloadedState = {}) {
  return createStore(
    rootReducer,
    preloadedState,
    composeWithDevToolsDevelopmentOnly(
      applyMiddleware(...middlewares),
    )
  );
}

const store = setupStore();

sagaMiddleware.run(rootSaga);

export default store;
