/* eslint-disable consistent-return */

// api
import { request } from '../axios/axios';

/**
 * uid로 유저정보 조회
 * @param {유저 고유 아이디} uid
 * @returns 유저 데이터
 */
export const getUserByUid = async (uid) => {
  try {
    const res = await request.get(`/api/user/${uid}`);
    if (res) {
      return res.data;
    }
  } catch (error) {
    return error;
  }
};
