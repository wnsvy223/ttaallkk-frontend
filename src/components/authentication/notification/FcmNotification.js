// react-router-dom
import { useNavigate } from 'react-router-dom';

// material ui
import { Avatar, Stack, Box, Button } from '@material-ui/core';

// toast ui viewer
import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

// toast ui viewer override css for custom
import './style/toastui-override.css';

// toastify
import { toast } from 'react-toastify';

// firebase
import firebase from 'firebase/app';
import 'firebase/messaging';

// recoil
import { useSetRecoilState } from 'recoil';
import { notificationCountState } from '../../../recoil/atom';

// api
import { removeDeviceToken } from '../../../api/firebase/FcmService';

// utils
import decodeHtmlEntity from '../../../utils/decodeHtmlEntity';

export default function FcmNotification() {
  const navigate = useNavigate();

  const setNotificationCount = useSetRecoilState(notificationCountState); // 알림 카운트 상태값

  /**
   * 알림끄기 버튼 클릭 시 토큰제거 함수 호출하여 알림 수신되지 않도록 설정
   */
  const handleOffNotification = () => {
    removeDeviceToken();
  };

  /**
   * 보러가기 버튼 클릭 시 해당 url 페이지로 이동
   * @param {FCM 페이로드} payload
   */
  const handleClickToast = (payload) => {
    const { notificationType, categoryTag, postId } = payload.data;
    switch (notificationType) {
      case 'comment':
        navigate(`/dashboard/community/${categoryTag}/${postId}`);
        break;
      case 'childrencomment':
        navigate(`/dashboard/community/${categoryTag}/${postId}`);
        break;
      default:
    }
  };

  /**
   * FCM 페이로드 데이터에서 notificationType, title 값을 받아 타입별로 토스트 메시지를 생성하여 반환
   * @param {알림 타입} notificationType
   * @param {알림 제목} title
   * @returns string : 타입별 토스트 메시지
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

  /**
   * 포그라운드 FCM 메시지 수신 시 이미지가 포함된 커스텀 토스트 메시지 호출
   */
  firebase.messaging().onMessage((payload) => {
    console.log(JSON.stringify(payload));
    const { title, body, imageUrl, notificationType } = payload.data;
    const toastTitle = setToastTitle(notificationType, title);
    setNotificationCount((prev) => prev + 1);

    toast(
      () => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Avatar
            src={'/favicon/android-chrome-192x192.png' || imageUrl}
            sx={{ m: 1, width: 30, height: 30 }}
          />
          <Stack
            direction="column"
            spacing={1}
            sx={{ wordBreak: 'break-all', textAlign: 'center', width: '100%' }}
          >
            <Box sx={{ fontSize: 11 }}>{toastTitle}</Box>
            <Viewer initialValue={decodeHtmlEntity(body)} />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={5}
              sx={{ backgroundColor: '#FFF', p: 0.3, borderRadius: 1 }}
            >
              <Button size="small" color="info" onClick={() => handleClickToast(payload)}>
                보러가기
              </Button>
              <Button size="small" color="info" onClick={handleOffNotification}>
                알림끄기
              </Button>
            </Stack>
          </Stack>
        </Stack>
      ),
      {
        autoClose: 7000,
        style: { backgroundColor: '#053C5C', color: '#FFFFFF' }
      }
    );
  });

  return null;
}
