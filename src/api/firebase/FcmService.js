// toast
import { toast } from 'react-toastify';

// firebase
import firebase from 'firebase/app';
import 'firebase/messaging';
import { firebaseApp } from './FirebaseApp';

// api
import { request } from '../axios/axios';

// utils
import storage from '../../utils/storage';

/**
 * 디바이스 토큰 발급
 */
export function getDeviceToken() {
  if (firebase.messaging.isSupported() && Notification.permission === 'granted') {
    firebaseApp
      .messaging()
      .getToken()
      .then((currentToken) => {
        if (currentToken) {
          storage.set('isSubscribe', true);
          updateDeviceToken(currentToken);
        }
      })
      .catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
  }
}

/**
 * 디바이스 토큰 제거
 */
export function removeDeviceToken() {
  const isSubscribe = storage.get('isSubscribe') || false;
  if (firebase.messaging.isSupported()) {
    if (isSubscribe === true) {
      firebaseApp
        .messaging()
        .getToken()
        .then((currentToken) => {
          if (currentToken) {
            firebaseApp
              .messaging()
              .deleteToken()
              .then(() => {
                storage.set('isSubscribe', false);
                toast.error('알림 설정 중지되었습니다.', {
                  position: toast.POSITION.BOTTOM_CENTER
                });
              })
              .catch((err) => {
                console.log('Unable to delete token. ', err);
              });
          }
        })
        .catch((err) => {
          console.log('Error retrieving Instance ID token. ', err);
        });
    }
  }
}

/**
 * 서버에 디바이스 토큰 저장 요청
 * @param {디바이스 토큰} currentToken
 */
const updateDeviceToken = (currentToken) => {
  const user = storage.get('user');
  const body = {
    deviceToken: currentToken,
    uid: user?.uid
  };
  request
    .put(`/api/user/devicetoken`, body)
    .then((res) => {
      if (res.data?.status === 200) {
        toast.info('알림 설정 되었습니다.', {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    })
    .catch((error) => {
      console.log(`디바이스 토큰 업데이트 오류 : ${error}`);
    });
};
