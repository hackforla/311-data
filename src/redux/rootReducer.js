import { combineReducers } from 'redux';
import data from './reducers/data';
import filters from './reducers/filters';
import ui from './reducers/ui';
import comparisonData from './reducers/comparisonData';
import comparisonFilters from './reducers/comparisonFilters';

export default combineReducers({
  data,
  filters,
  ui,
  comparisonData,
  comparisonFilters,
});
