import { combineReducers } from 'redux';
import auth from './auth';
import message from './message';
import userSearch from './userSearch';
import { LOG_OUT } from '../actionType/type';

const appReducer = combineReducers({
  auth,
  message,
  userSearch
});

const rootReducer = (state, action) => {
  if (action.type === LOG_OUT) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
