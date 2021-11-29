import { combineReducers } from 'redux';
import auth from './auth';
import message from './message';
import userSearch from './userSearch';
import post from './post';

const rootReducer = combineReducers({
  auth,
  message,
  userSearch,
  post
});

export default rootReducer;
