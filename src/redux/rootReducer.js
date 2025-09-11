import { combineReducers } from 'redux';
import metadata from './reducers/metadata';
import data from './reducers/data';
import filters from './reducers/filters';
import ui from './reducers/ui';
import mapFilters from './reducers/mapFilters';

export default combineReducers({
  metadata,
  data,
  filters,
  ui,
  mapFilters,
});
