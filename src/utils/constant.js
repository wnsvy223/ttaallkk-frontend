// 비 로그인 유저 식별자
export const anonymousUserIdentifier = 'anonymous';

// 공개방 구분 키값
export const publicRoomIdentifier = 'publicRoomIdentifier';

// 대화방 참가 제한 인원 수
export const defaultMaxParticipantsAllowed = 15;

// 메시지 리스트 전역 상태 변수에 기본값으로 저장되는 디바이더 메시지 객체
export const initialMessage = {
  type: 'systemMessage',
  isDividerMessage: true
};

/* 
데이터 채널로 데이터 송수신할 때, 한번에 보낼 데이터의 단위값.
RTCMultiConnection의 경우 60KB까지 제공 - 내부적으로는 16KB로 다시 나누어 보내는 방식.
병렬 데이터 채널 전송을 위해 16KB로만 사용하도록 설정
*/
export const chunkSize = 16384; // 16KB
