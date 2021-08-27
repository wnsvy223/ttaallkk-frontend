import { combineReducers } from 'redux';
import auth from './user';
import message from './message';

const rootReducer = combineReducers({
  auth,
  message
});

export default rootReducer;
