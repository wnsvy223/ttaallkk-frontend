import {
  SIGNIN_SUCCESS,
  SIGNIN_FAILURE,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOG_OUT_SUCCESS,
  UPDATE_PROFILE,
  UPDATE_PROFILE_IMAGE
} from '../actionType/type';
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
    case LOG_OUT_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
        user: null
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        user: payload.user
      };
    case UPDATE_PROFILE_IMAGE:
      return {
        ...state,
        user: {
          ...state.user,
          profileUrl: payload.profileUrl
        }
      };
    default:
      return state;
  }
}
