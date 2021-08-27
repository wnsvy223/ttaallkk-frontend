import { SIGNIN_SUCCESS, SIGNIN_FAILURE, SIGNUP_SUCCESS, SIGNUP_FAILURE } from './type';
import { request } from '../axios/axios';
import { setMessage } from './messageAction';

const url = '/api/user';

// -------------------------------로그인---------------------------------------
// 로그인 axios 요청
export const signInUser = (req) => async (dispatch) => {
  try {
    const res = await request.post(`${url}/login`, req);
    dispatch({
      type: SIGNIN_SUCCESS,
      payload: { user: res.data }
    });
    dispatch(setMessage(res.data.message));
    return Promise.resolve(res.data);
  } catch (error) {
    dispatch({
      type: SIGNIN_FAILURE
    });
    dispatch(setMessage(error.message));
    return Promise.reject(error);
  }
};

// -------------------------------회원가입---------------------------------------
// 회원가입 axios 요청
export const signUpUser = (req) => async (dispatch) => {
  try {
    const res = await request.post(`${url}/signUp`, req);
    dispatch({
      type: SIGNUP_SUCCESS,
      payload: { user: res.data }
    });
    dispatch(setMessage(res.data.message));
    return Promise.resolve(res.data);
  } catch (error) {
    dispatch({
      type: SIGNUP_FAILURE
    });
    dispatch(setMessage(error.message));
    return Promise.reject(error);
  }
};
// -----------------------------------------------------------------------------
