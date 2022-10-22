/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.24.0/firebase-messaging.js');

// 포그라운드 푸시 클릭 (FCM 초기화 전에 클릭 콜백이 정의되어있으면 파이어폭스 브라우저에서 클릭 동작 안하는 이슈있음.)
self.onnotificationclick = (event) => {
  event.preventDefault();
  event.notification.close();
  console.log('포그라운드 푸시 클릭');
};

// 백그라운드 처리
firebase.initializeApp({
  apiKey: 'AIzaSyAO2EsLBIg6XRvgSCpOzFYg6cVzI0JvjEY',
  authDomain: 'webvoice-d99c6.firebaseapp.com',
  databaseURL: 'https://webvoice-d99c6.firebaseio.com',
  projectId: 'webvoice-d99c6',
  storageBucket: 'webvoice-d99c6.appspot.com',
  messagingSenderId: '486884665140',
  appId: '1:486884665140:web:95ae5c5b2edd27b0',
  measurementId: 'G-BEKXY7G9VJ'
});
const messaging = firebase.messaging();

/**
 * FCM 페이로드 데이터에서 notificationType, title 값을 받아 타입별로 알림 메시지를 생성하여 반환
 * @param {알림 타입} notificationType
 * @param {알림 제목} title
 * @returns string : 타입별 알림 메시지
 */
// eslint-disable-next-line consistent-return
const setToastTitle = (notificationType, title) => {
  switch (notificationType) {
    case 'comment':
      return `${title}님이 게시글에 댓글을 달았습니다`;
    case 'childrencomment':
      return `${title}님이 댓글에 답글을 달았습니다`;
    default:
  }
};

messaging.onBackgroundMessage((payload) => {
  // 백그라운드 푸시 클릭
  self.onnotificationclick = (event) => {
    event.preventDefault();
    event.notification.close();
    console.log('백그라운드 푸시 클릭');
  };

  const { title, body, imageUrl, notificationType } = payload.data;
  const notificationTitle = setToastTitle(notificationType, title);
  const notificationOptions = {
    body,
    icon: '/favicon/android-chrome-192x192.png' || imageUrl,
    vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500],
    data: {
      notificationType
    }
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
