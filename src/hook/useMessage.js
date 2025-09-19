import { useState } from 'react';

// Moment
import moment from 'moment';

// recoil
import { useRecoilValue, useRecoilState } from 'recoil';
import { chatActiveState, messageListState } from '../recoil/atom';

// api
import connection from '../api/rtcmulticonnection/RTCMultiConnection';

const useMessage = () => {
  const [speak, setSpeak] = useState({});
  const [messageList, setMessageList] = useRecoilState(messageListState);
  const [progressFileUuid, setProgressFileUuid] = useState('');
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

  // 파일 공유 시작 이벤트
  // : 파일 데이터를 메시지 데이터 배열에 추가
  connection.onFileStart = (file) => {
    OnFileShareStart(file);
  };

  // 파일 공유 진행상황 이벤트
  // : 업로드 진행상황 업데이트
  connection.onFileProgress = (file) => {
    OnFileShareProgress(file);
  };

  // 파일 공유 완료 이벤트
  // : onFileStart에서 추가한 배열 요소중 uuid값이 같은(동일한 파일)요소 제거 후 새로운 데이터를 메시지 데이터 배열에 추가
  // : 파일 공유 완료이벤트 수신 시 채팅창 활성화 X + 보낸 사람이 아닐 경우에 읽지않은 메시지 카운트 값 증가
  connection.onFileEnd = (file) => {
    OnFileShareEnd(file);
  };

  // 파일 공유 시작 메시지 세팅
  function OnFileShareStart(file) {
    const extra = connection.getExtraData(file.userid);
    const fileMessage = {
      type: 'textMessage',
      text:
        connection?.userid === file.userid
          ? `파일 전송중...`
          : `${extra.displayName}님이 파일 전송중...`,
      userid: file.userid,
      displayName: extra.displayName,
      profileUrl: extra.profileUrl,
      file
    };
    resetDividerPosition();
    setMessageList((prev) => {
      const filtered = prev.filter((data) => data?.file?.uuid !== file?.uuid);
      return [...filtered, fileMessage];
    });
    // console.log('파일 공유 시작:', file);
  }

  // 파일 공유 종료 메시지 세팅
  function OnFileShareEnd(file) {
    const extra = connection.getExtraData(file.userid);
    const fileMessage = {
      type: 'textMessage',
      text: file?.name,
      userid: file.userid,
      displayName: extra.displayName,
      profileUrl: extra.profileUrl,
      file
    };
    resetDividerPosition();
    setMessageList((prev) => {
      const filtered = prev.filter((data) => data?.file?.uuid !== file?.uuid);
      return [...filtered, fileMessage];
    });
    if (!isChatActive && file.extra.userid !== connection.userid) {
      setUnReadMessageCount((count) => count + 1);
    }
    // 파일 공유 종료 시 현재 진행 중인 파일 UUID 초기화
    if (progressFileUuid === file.uuid) {
      setProgressFileUuid('');
    }
    // console.log('파일 공유 종료:', file.uuid);
  }

  // 파일 공유 진행 상태 세팅
  function OnFileShareProgress(file) {
    const progress = Math.round((file.currentPosition * 100) / file.maxChunks);
    // React 상태 업데이트 없이 DOM 직접 조작
    const progressBars = document.querySelectorAll(`[data-file-uuid="${file.uuid}"]`);
    progressBars.forEach((progressBar) => {
      // LinearProgress의 내부 bar 요소 찾아서 직접 width 조정
      const barElement = progressBar.querySelector('.MuiLinearProgress-bar');
      if (barElement) {
        barElement.style.transform = `translateX(-${100 - progress}%)`;
      }
    });
    // console.log('파일 공유 진행중:', progress, '%');
  }

  // 디바이더 아이템 찾기
  function findDividerItem(list) {
    const dividerIndex = list?.findIndex((data) => data?.isDividerMessage === true);
    if (dividerIndex === -1) {
      return { item: null, filteredList: list };
    }
    const item = list[dividerIndex];
    const filteredList = list.filter((_, index) => index !== dividerIndex);
    return { item, filteredList };
  }

  // 디바이더 아이템 위치 변경(읽지않은 메시지 목록중 첫 요소 해당하는 인덱스)
  function setDividerPosition() {
    setMessageList((prevMessageList) => {
      const { item, filteredList } = findDividerItem(prevMessageList);
      if (!item) {
        return prevMessageList;
      }
      const insertPosition = Math.max(0, filteredList.length - unReadMessageCount);
      return [
        ...filteredList.slice(0, insertPosition),
        item,
        ...filteredList.slice(insertPosition)
      ];
    });
  }

  // 디바이더 아이템 위치 0번 인덱스 위치로 리셋
  function resetDividerPosition() {
    setMessageList((prevMessageList) => {
      const { item, filteredList } = findDividerItem(prevMessageList);
      if (!item) {
        return prevMessageList;
      }
      return [item, ...filteredList];
    });
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
