import { combineReducers } from 'redux';
import data from './reducers/data';
import filters from './reducers/filters';
import ui from './reducers/ui';

export default combineReducers({
  data,
  filters,
  ui,
});
