import { combineReducers } from 'redux';
import auth from './auth';
import message from './message';
import userSearch from './userSearch';
import post from './post';
import friend from './friend';

const rootReducer = combineReducers({
  auth,
  message,
  userSearch,
  post,
  friend
});

export default rootReducer;
