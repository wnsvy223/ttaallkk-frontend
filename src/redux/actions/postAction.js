import { request } from '../../api/axios/axios';
import { GET_POST, UPDATE_POST, DELETE_POST } from '../actionType/type';

const url = '/api/post';

// 게시글 조회
export const getPost = (postId) => async (dispatch) => {
  try {
    const res = await request.get(`${url}/${postId}`);
    dispatch({
      type: GET_POST,
      payload: res.data
    });
    return Promise.resolve(res.data);
  } catch (error) {
    return Promise.reject(error.message);
  }
};

// 게시글 수정
export const updatePost = (postId, body) => async (dispatch) => {
  try {
    const res = await request.put(`${url}/${postId}`, body);
    dispatch({
      type: UPDATE_POST,
      payload: res.data
    });
    return Promise.resolve(res.data);
  } catch (error) {
    return Promise.reject(error.message);
  }
};

// 게시글 삭제
export const deletePost = (postId) => async (dispatch) => {
  try {
    const res = await request.delete(`${url}/${postId}`);
    dispatch({
      type: DELETE_POST,
      payload: res.data
    });
    return Promise.resolve(res.data);
  } catch (error) {
    return Promise.reject(error.message);
  }
};
