import { SIGNIN_SUCCESS, SIGNIN_FAILURE } from './type';
import { request } from '../axios/axios';

const url = '/api/user';

// 로그인 axios 요청
export const signInUser = (req) => async (dispatch) => {
  try {
    const res = await request.post(`${url}/login`, req);
    dispatch(signInSuccess(res.data));
    return Promise.resolve(res.data);
  } catch (error) {
    dispatch(signInFailure(error));
    return Promise.reject(error);
  }
};

// 로그인 성공 액션 생성 함수
export function signInSuccess(res) {
  return {
    type: SIGNIN_SUCCESS,
    payload: res
  };
}

// 로그인 실패 액션 생성 함수
export function signInFailure(error) {
  return {
    type: SIGNIN_FAILURE,
    payload: error
  };
}
