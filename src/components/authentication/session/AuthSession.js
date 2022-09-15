import { useEffect } from 'react';

// react-router-dom
import { useNavigate } from 'react-router-dom';

// moment
import moment from 'moment';

// toastify
import { toast } from 'react-toastify';

// api
import { removeDeviceToken } from '../../../api/firebase/FcmService';

// utils
import storage from '../../../utils/storage';

export default function AuthSession() {
  const navigate = useNavigate();
  const user = storage.get('user');
  const isSessionExpired = user?.expiredAtRefereshToken;

  /**
   * 세션 만료 체크 : 로컬스토리지에 저장된 토큰만료 타임스탬프 값을 체크하여 세션이 만료되었을 시
   * 로컬스토리지에 저장된 유저정보 제거 및 로그인 페이지 이동
   */
  useEffect(() => {
    const now = moment.now();
    if (isSessionExpired && moment(now).isAfter(isSessionExpired)) {
      storage.remove('user');
      removeDeviceToken();
      toast.error('인증이 만료되어 로그인 페이지로 이동합니다.', {
        position: toast.POSITION.TOP_CENTER
      });
      navigate('/login', { replace: true });
    }
  }, [isSessionExpired, navigate]);

  return null;
}
