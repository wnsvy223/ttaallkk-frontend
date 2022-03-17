import { useState } from 'react';

// Moment
import moment from 'moment';

// recoil
import { useRecoilValue } from 'recoil';
import { chatActiveState } from '../recoil/atom';

// api
import connection from '../api/rtcmulticonnection/RTCMultiConnection';

// utils
import { initialMessage } from '../utils/constant';

const useMessage = () => {
  const [speak, setSpeak] = useState({});
  const [messageList, setMessageList] = useState([initialMessage]);
  const [unReadMessageCount, setUnReadMessageCount] = useState(0);
  const isChatActive = useRecoilValue(chatActiveState);

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
        resetDividerPosition();
        setMessageList((message) => [...message, event.data]);
        if (!isChatActive) setUnReadMessageCount((count) => count + 1);
        break;
      default:
    }
  };

  // 상대방과 data channel 닫힐 시 대화상태값 초기화
  connection.onclose = () => {
    setSpeak({});
  };

  // 참가자 입장 시 메시지 상태값 업데이트
  connection.onopen = (event) => {
    const systemMessage = {
      type: 'systemMessage',
      text: `${event?.extra?.displayName}님이 방에 참가했습니다.`,
      displayName: connection?.extra?.displayName,
      profileUrl: connection?.extra?.profileUrl,
      timeStamp: moment()
    };
    resetDividerPosition();
    setMessageList((message) => [...message, systemMessage]);
  };

  // 참가자 퇴장 시 메시지 상태값 업데이트
  connection.onleave = (event) => {
    const systemMessage = {
      type: 'systemMessage',
      text: `${event?.extra?.displayName}님이 방을 나갔습니다.`,
      displayName: connection?.extra?.displayName,
      profileUrl: connection?.extra?.profileUrl,
      timeStamp: moment()
    };
    resetDividerPosition();
    setMessageList((message) => [...message, systemMessage]);
  };

  // 디바이더 아이템 찾기
  function findDividerItem(list) {
    const item = list?.splice(
      list?.findIndex((data) => data?.isDividerMessage === true),
      1
    );
    return item;
  }

  // 디바이더 아이템 위치 변경(읽지않은 메시지 목록중 첫 요소 해당하는 인덱스)
  function setDividerPosition() {
    const messages = [...messageList];
    const item = findDividerItem(messages);
    messages?.splice(messages?.length - unReadMessageCount, 0, item[0]);
    setMessageList(messages);
  }

  // 디바이더 아이템 위치 0번 인덱스 위치로 리셋
  function resetDividerPosition() {
    const messages = [...messageList];
    const item = findDividerItem(messages);
    messages?.splice(0, 0, item[0]);
    setMessageList(messages);
  }

  return {
    speak,
    setSpeak,
    messageList,
    setMessageList,
    unReadMessageCount,
    setUnReadMessageCount,
    findDividerItem,
    setDividerPosition,
    resetDividerPosition
  };
};

export default useMessage;
