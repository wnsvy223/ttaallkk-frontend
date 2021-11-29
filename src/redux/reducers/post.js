import { GET_POST, UPDATE_POST, DELETE_POST } from '../actionType/type';

const initialState = {};

export default function post(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POST:
      return {
        ...state,
        contents: payload
      };

    case UPDATE_POST:
      return {
        ...state,
        contents: payload
      };

    case DELETE_POST:
      return {
        ...state,
        contents: null
      };

    default:
      return state;
  }
}
