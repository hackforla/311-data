import { combineReducers } from 'redux';
import data from './reducers/data';
import ui from './reducers/ui';

export default combineReducers({
  data,
  ui,
});
