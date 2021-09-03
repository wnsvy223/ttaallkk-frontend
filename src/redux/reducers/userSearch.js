import { SEARCH_USER } from '../actionType/type';

const initialState = {};

export default function userSearch(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SEARCH_USER:
      return { result: payload };

    default:
      return state;
  }
}
