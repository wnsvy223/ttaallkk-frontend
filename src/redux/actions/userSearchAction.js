import { request } from '../../api/axios/axios';
import { SEARCH_USER } from '../actionType/type';

const url = '/api/user/search';

export const searchUser = (keyword, page) => async (dispatch) => {
  try {
    const res = await request.get(`${url}?keyword=${keyword}&page=${page}`);
    dispatch({
      type: SEARCH_USER,
      payload: { result: res.data }
    });
    return Promise.resolve(res.data);
  } catch (error) {
    return Promise.reject(error.message);
  }
};
