import axios from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';

export const request = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // 시큐어 쿠키를 전송받기 위한 설정.
  Accept: 'application/json',
  headers: { 'Cache-Control': 'no-cache' },
  adapter: cacheAdapterEnhancer(axios.defaults.adapter) // axios 캐시 확장모듈 설정
});

// 요청 인터셉터
axios.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// 응답 인터셉터
axios.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);
