export const anonymousUserIdentifier = 'anonymous'; // 비 로그인 유저 식별자
export const publicRoomIdentifier = 'publicRoomIdentifier'; // 공개방 구분 키값
export const defaultMaxParticipantsAllowed = 15; // 대화방 참가 제한 인원 수
// 메시지 리스트 전역 상태 변수에 기본값으로 저장되는 디바이더 메시지 객체
export const initialMessage = {
  type: 'systemMessage',
  isDividerMessage: true
};
