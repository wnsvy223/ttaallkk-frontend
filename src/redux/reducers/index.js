import { combineReducers } from 'redux';
import auth from './auth';
import message from './message';
import userSearch from './userSearch';

const rootReducer = combineReducers({
  auth,
  message,
  userSearch
});

export default rootReducer;
