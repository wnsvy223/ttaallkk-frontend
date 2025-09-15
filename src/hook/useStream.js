import { useState } from 'react';

// Moment
import moment from 'moment';

import { useSetRecoilState } from 'recoil';
import { messageListState } from '../recoil/atom';

// api
import connection from '../api/rtcmulticonnection/RTCMultiConnection';
import initHark from '../api/rtcmulticonnection/Hark';

/**
 * onstream, onstreamended 이벤트 호출에 따라 대화 참가자들의 스트림데이터 추가 및 제거
 */
const useStream = () => {
  const setMessageList = useSetRecoilState(messageListState);
  const [participants, setParticipants] = useState([]);
  const [isConversation, setIsConversation] = useState(false);

  connection.onstream = (event) => {
    setParticipants((p) => [...p, event]);
    // hark.js 초기화
    initHark({
      stream: event.stream,
      event,
      connection
    });
    setConnectionMessage(event);
    setIsConversation(true);
  };

  function setConnectionMessage(event) {
    if (event.userid !== connection.userid) {
      const systemMessage = {
        type: 'systemMessage',
        text: `${event?.extra?.displayName}님이 방에 참가했습니다.`,
        displayName: connection?.extra?.displayName,
        profileUrl: connection?.extra?.profileUrl,
        timeStamp: moment()
      };
      setMessageList((message) => [...message, systemMessage]);
    }
  }

  connection.onstreamended = (event) => {
    setParticipants((p) => p.filter((user) => user.userid !== event.userid));
    setIsConversation(false);
  };

  return { participants, isConversation };
};

export default useStream;
