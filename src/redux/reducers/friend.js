import {
  FRIEND_ADD_SUCCESS,
  FRIEND_ADD_FAILURE,
  FRIEND_ACCEPT,
  FRIEND_REJECT,
  GET_FRIEND,
  ERROR
} from '../actionType/type';

const initialState = {};

export default function post(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_FRIEND:
      return {
        ...state,
        friends: payload,
        status: GET_FRIEND
      };

    case FRIEND_ADD_SUCCESS:
      return {
        ...state,
        friends: payload,
        status: FRIEND_ADD_SUCCESS
      };

    case FRIEND_ADD_FAILURE:
      return {
        ...state,
        friends: payload,
        status: FRIEND_ADD_FAILURE
      };

    case FRIEND_ACCEPT:
      return {
        ...state,
        friends: payload,
        status: FRIEND_ACCEPT
      };

    case FRIEND_REJECT:
      return {
        ...state,
        friends: payload,
        status: FRIEND_REJECT
      };

    case ERROR:
      return {
        ...state,
        error: payload
      };

    default:
      return state;
  }
}
