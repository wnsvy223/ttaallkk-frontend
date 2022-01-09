import { useState } from 'react';

// api
import connection from '../api/rtcmulticonnection/RTCMultiConnection';

const useMessage = () => {
  const [speak, setSpeak] = useState({});
  const [messageList, setMessageList] = useState([]);

  // webrtc data channel을 통해 넘어오는 이벤트 메시지 수신(대화상태값 및 텍스트 메시지)
  connection.onmessage = (event) => {
    switch (event.data.type) {
      case 'speaking':
        setSpeak(event.data);
        break;
      case 'silence':
        setSpeak(event.data);
        break;
      case 'textMessage':
        setMessageList((message) => [...message, event.data]);
        break;
      default:
    }
  };

  // 상대방과 data channel 닫힐 시 대화상태값 초기화
  connection.onclose = () => {
    setSpeak({});
  };

  return { speak, setSpeak, messageList, setMessageList };
};

export default useMessage;
