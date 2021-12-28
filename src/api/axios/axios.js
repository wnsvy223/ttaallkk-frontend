import axios from 'axios';
// import { cacheAdapterEnhancer } from 'axios-extensions';
import storage from '../../utils/storage';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const request = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // 시큐어 쿠키를 전송받기 위한 설정.
  Accept: 'application/json',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Cache-Control': 'no-cache'
  }
  // adapter: cacheAdapterEnhancer(axios.defaults.adapter) // axios 캐시 확장모듈 설정
});

// 요청 인터셉터
request.interceptors.request.use(
  (req) => req,
  (error) => Promise.reject(error)
);

/**
 * 응답 인터셉터
 * desc : UnAuthorized 예외 발생시 인터셉트하여 refreshToken을 이용해 accessToken갱신
 */
request.interceptors.response.use(
  (res) => res,
  (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest.url !== 'api/user/refreshToken/' &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return request(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        const user = storage.get('user');
        const email = user?.email;
        request
          .post('/api/user/refreshToken', {
            email,
            grantType: 'refreshToken'
          })
          .then(({ data }) => {
            request.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            processQueue(null, data.accessToken);
            resolve(request(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);
