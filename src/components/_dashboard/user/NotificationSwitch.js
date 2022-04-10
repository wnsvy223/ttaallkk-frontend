import { useState, useEffect } from 'react';

// material ui
import { Switch } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

// api
import { getDeviceToken, removeDeviceToken } from '../../../api/firebase/FcmService';

// utils
import storage from '../../../utils/storage';

const MaterialUISwitch = styled(Switch)(({ theme, checked }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" focusable="false" width="20" height="20" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" style="transform: rotate(360deg);"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M20.52 15.21l-1.8-1.81V8.94a6.86 6.86 0 0 0-5.82-6.88a6.74 6.74 0 0 0-7.62 6.67v4.67l-1.8 1.81A1.64 1.64 0 0 0 4.64 18H8v.34A3.84 3.84 0 0 0 12 22a3.84 3.84 0 0 0 4-3.66V18h3.36a1.64 1.64 0 0 0 1.16-2.79zM14 18.34A1.88 1.88 0 0 1 12 20a1.88 1.88 0 0 1-2-1.66V18h4z"></path></svg>')`
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be'
      }
    }
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: checked ? '#229A16' : '#ff0000',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" focusable="false" width="20" height="20" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" style="transform: rotate(360deg);"><path d="M15.88 18.71l-.59-.59L14 16.78l-.07-.07L6.58 9.4L5.31 8.14a5.68 5.68 0 0 0 0 .59v4.67l-1.8 1.81A1.64 1.64 0 0 0 4.64 18H8v.34A3.84 3.84 0 0 0 12 22a3.88 3.88 0 0 0 4-3.22zM14 18.34A1.88 1.88 0 0 1 12 20a1.88 1.88 0 0 1-2-1.66V18h4zM7.13 4.3l1.46 1.46l9.53 9.53l2 2l.31.3a1.58 1.58 0 0 0 .45-.6a1.62 1.62 0 0 0-.35-1.78l-1.8-1.81V8.94a6.86 6.86 0 0 0-5.83-6.88a6.71 6.71 0 0 0-5.32 1.61a6.88 6.88 0 0 0-.58.54zm13.58 14.99L19.41 18l-2-2l-9.52-9.53L6.42 5L4.71 3.29a1 1 0 0 0-1.42 1.42L5.53 7l1.75 1.7l7.31 7.3l.07.07L16 17.41l.59.59l2.7 2.71a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42z" fill="${encodeURIComponent(
        '#fff'
      )}"></path></svg>')`
    }
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2
  }
}));

export default function NoficiationSwitch() {
  const isSubscribe = storage.get('isSubscribe') || false;
  const [checked, setChecked] = useState(isSubscribe);

  // 스위치 상태값 토글 및 FCM 디바이스 토큰 관리 함수 호출
  const handleChange = () => {
    setChecked((prev) => !prev);
    if (!checked) {
      getDeviceToken();
      storage.set('isSubscribe', true);
    } else {
      removeDeviceToken();
      storage.set('isSubscribe', false);
    }
  };

  // 알림 권한 요청 및 권한 상태 확인
  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('알림 권한 승인됨');
        } else if (permission === 'denied') {
          console.log('알림 권한 거부');
          setChecked(false);
          storage.set('isSubscribe', false);
        } else {
          console.log('알림 권한 미설정');
          setChecked(false);
          storage.set('isSubscribe', false);
        }
      });
    }
  }, []);

  // 로컬스토리지에 저장된 알림수신 설정값에 따라 스위치 상태값 변경
  useEffect(() => {
    if (isSubscribe) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [isSubscribe]);

  return <MaterialUISwitch checked={checked} onChange={handleChange} />;
}
