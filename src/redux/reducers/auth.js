import { SIGNIN_SUCCESS, SIGNIN_FAILURE, SIGNUP_SUCCESS, SIGNUP_FAILURE } from '../actionType/type';
import storage from '../../utils/storage';

const user = storage.get('user');
const initialState = user ? { isLoggedIn: true, user } : { isLoggedIn: false, user: null };

export default function auth(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SIGNUP_SUCCESS:
      return {
        ...state,
        isLoggedIn: false
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        isLoggedIn: false
      };
    case SIGNIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user
      };
    case SIGNIN_FAILURE:
      return {
        ...state,
        isLoggedIn: false,
        user: null
      };
    default:
      return state;
  }
}
