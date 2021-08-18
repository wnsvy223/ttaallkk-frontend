import { combineReducers } from 'redux';
import signIn from './userReducer';

const rootReducer = combineReducers({
  signIn
});

export default rootReducer;
