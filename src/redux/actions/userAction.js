import {
  SIGNIN_SUCCESS,
  SIGNIN_FAILURE,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  LOG_OUT_SUCCESS,
  UPDATE_PROFILE,
  UPDATE_PROFILE_IMAGE,
  SESSION_EXPIRED
} from '../actionType/type';
import { request } from '../../api/axios/axios';
import { setMessage } from './messageAction';

const url = '/api/user';

// 로그인
export const logIn = (req) => async (dispatch) => {
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

// 로그아웃
export const logOut = () => async (dispatch) => {
  try {
    const res = await request.post(`${url}/logout`);
    dispatch({
      type: LOG_OUT_SUCCESS
    });
    dispatch(setMessage(res.data.message));
    return Promise.resolve(res.data);
  } catch (error) {
    dispatch(setMessage(error.message));
    return Promise.reject(error);
  }
};

// 세션만료
export const sessionExpired = () => async (dispatch) => {
  try {
    dispatch({
      type: SESSION_EXPIRED
    });
    return Promise.resolve({
      type: SESSION_EXPIRED,
      isSessionExpired: true
    });
  } catch (error) {
    dispatch(setMessage(error.message));
    return Promise.resolve(error.message);
  } finally {
    dispatch({
      type: SESSION_EXPIRED
    });
  }
};

// 회원가입
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

// 프로필 업데이트
export const updateProfile = (req) => async (dispatch) => {
  try {
    const res = await request.put(`${url}/${req.uid}`, req);
    dispatch({
      type: UPDATE_PROFILE,
      payload: { user: res.data }
    });
    return Promise.resolve(res.data);
  } catch (error) {
    return Promise.reject(error);
  }
};

// 프로필 이미지 업데이트
export const updateProfileImage = (req) => async (dispatch) => {
  try {
    const res = await request.post(`/api/user/${req.uid}/profile`, req.formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    dispatch({
      type: UPDATE_PROFILE_IMAGE,
      payload: { profileUrl: res.data }
    });
    return Promise.resolve(res.data);
  } catch (error) {
    return Promise.reject(error);
  }
};
