import { useState } from 'react';

// Moment
import moment from 'moment';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { messageListState, participantListState } from '../recoil/atom';

// api
import connection from '../api/rtcmulticonnection/RTCMultiConnection';
import initHark from '../api/rtcmulticonnection/Hark';

/**
 * 참가자 목록은 다음 두 경로로 갱신된다.
 *  - onstream/onstreamended : 오디오 스트림을 주고받는 참가자
 *  - onopen/onleave         : 데이터 채널만 연결된(채팅 전용) 참가자
 * 동일 userid가 중복 추가되지 않도록 dedup 처리한다.
 */
const useStream = () => {
  const setMessageList = useSetRecoilState(messageListState);
  const [participants, setParticipants] = useRecoilState(participantListState);
  const [isConversation, setIsConversation] = useState(false);

  // onopen(데이터 채널만) 전용: 이미 등록된 사용자면 스킵
  const addDataOnlyParticipant = (event) => {
    setParticipants((prev) => {
      if (prev.some((p) => p.userid === event.userid)) return prev;
      return [...prev, event];
    });
  };

  // onstream(스트림 포함) 전용: 기존 data-only 엔트리를 스트림 이벤트로 교체
  const upsertStreamParticipant = (event) => {
    setParticipants((prev) => {
      const filtered = prev.filter((p) => p.userid !== event.userid);
      return [...filtered, event];
    });
  };

  const removeParticipant = (userid) => {
    setParticipants((prev) => prev.filter((p) => p.userid !== userid));
  };

  connection.onstream = (event) => {
    // Recoil 동결 방지를 위해 extra 스냅샷 복사(원본 connection.extra 가변성 유지)
    const snapshot = {
      userid: event.userid,
      extra: { ...(event.extra || {}) },
      type: event.type,
      stream: event.stream,
      streamid: event.streamid,
      mediaElement: event.mediaElement
    };
    upsertStreamParticipant(snapshot);
    initHark({
      stream: event.stream,
      event,
      connection
    });
    setConnectionMessage(event);
    setIsConversation(true);
  };

  connection.onstreamended = (event) => {
    // 데이터 채널은 유지될 수 있으므로 여기서는 제거하지 않는다.
    // 참가자 목록 제거는 onleave에서 담당.
    setIsConversation(false);
    if (event?.stream) {
      try {
        event.stream.getTracks?.().forEach((track) => track.stop());
      } catch (error) {
        console.warn('stream cleanup failed:', error);
      }
    }
  };

  // 데이터 채널이 열리면(스트림 유무와 무관) 참가자로 등록
  connection.onopen = (event) => {
    addDataOnlyParticipant({
      userid: event.userid,
      extra: { ...(event.extra || {}) }, // 동결 방지 얕은 복사
      type: 'remote'
    });
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

  return { participants, isConversation, addDataOnlyParticipant, removeParticipant };
};

export default useStream;
