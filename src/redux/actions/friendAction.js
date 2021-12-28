import {
  FRIEND_ADD_SUCCESS,
  FRIEND_ADD_FAILURE,
  FRIEND_ACCEPT,
  FRIEND_REJECT,
  GET_FRIEND,
  ERROR
} from '../actionType/type';
import { request } from '../../api/axios/axios';

const url = '/api/friend';

// 친구 조회
export const getFriend = (page) => async (dispatch) => {
  try {
    const res = await request.get(`${url}?page=${page}`);
    dispatch({
      type: GET_FRIEND,
      payload: res.data
    });
    return Promise.resolve(res.data);
  } catch (error) {
    dispatch({
      type: ERROR,
      payload: error?.response?.data
    });
    return Promise.reject(error);
  }
};

// 친구 추가
export const addFriend = (req) => async (dispatch) => {
  try {
    const res = await request.post(`${url}`, req);
    dispatch({
      type: FRIEND_ADD_SUCCESS,
      payload: res.data
    });
    return Promise.resolve(res.data);
  } catch (error) {
    dispatch({
      type: FRIEND_ADD_FAILURE,
      payload: error?.response?.data
    });
    return Promise.reject(error);
  }
};

// 친구 수락
export const acceptFriend = (req) => async (dispatch) => {
  try {
    const res = await request.put(`${url}/accept`, req);
    dispatch({
      type: FRIEND_ACCEPT,
      payload: res.data
    });
    return Promise.resolve(res.data);
  } catch (error) {
    dispatch({
      type: ERROR,
      payload: error?.response?.data
    });
    return Promise.reject(error);
  }
};

// 친구 거절
export const rejectFriend = (req) => async (dispatch) => {
  try {
    const res = await request.put(`${url}/reject`, req);
    dispatch({
      type: FRIEND_REJECT,
      payload: res.data
    });
    return Promise.resolve(res.data);
  } catch (error) {
    dispatch({
      type: ERROR,
      payload: error?.response?.data
    });
    return Promise.reject(error);
  }
};
