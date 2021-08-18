import axios from 'axios';

export const request = axios.create({
  baseURL: 'https://ttaallkk.duckdns.org',
  withCredentials: true // 시큐어 쿠키를 전송받기 위한 설정.
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
