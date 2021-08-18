import { SIGNIN_SUCCESS, SIGNIN_FAILURE } from '../action/type';

export default function signIn(state = {}, action) {
  switch (action.type) {
    case SIGNIN_SUCCESS:
      return { ...state, success: action.payload };
    case SIGNIN_FAILURE:
      return { ...state, failure: action.payload };
    default:
      return state;
  }
}
