import { useState } from 'react';

// api
import connection from '../api/rtcmulticonnection/RTCMultiConnection';
import initHark from '../api/rtcmulticonnection/Hark';

/**
 * onstream, onstreamended, onleave 이벤트 호출에 따라 대화 참가자들의 스트림데이터 추가 및 제거
 */
const useStream = () => {
  const [participants, setParticipants] = useState([]);

  connection.onstream = (event) => {
    setParticipants((p) => [...p, event]);
    // hark.js 초기화
    initHark({
      stream: event.stream,
      event,
      connection
    });
  };

  connection.onstreamended = (event) => {
    setParticipants((p) => p.filter((user) => user.userid !== event.userid));
  };

  connection.onleave = (event) => {
    setParticipants((p) => p.filter((user) => user.userid !== event.userid));
  };

  return { participants };
};

export default useStream;
