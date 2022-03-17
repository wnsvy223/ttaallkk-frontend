import { useEffect, useContext } from 'react';

// material ui
import { styled } from '@material-ui/core/styles';
import { Stack, Box, Button, IconButton, Badge } from '@material-ui/core';
import { Icon } from '@iconify/react';
import micOutline from '@iconify/icons-eva/mic-outline';
import micOffOutline from '@iconify/icons-eva/mic-off-outline';
import personAddOutline from '@iconify/icons-eva/person-add-outline';
import MessageCircleOutline from '@iconify/icons-eva/message-circle-outline';
import MessageCircleFill from '@iconify/icons-eva/message-circle-fill';

// recoil
import { useSetRecoilState, useRecoilState } from 'recoil';
import { conferenceState, muteState, chatActiveState } from '../../recoil/atom';

// context
import { MessageContext } from '../../api/context/MessageContext';

// api
import connection, { handleDisconnectRTC } from '../../api/rtcmulticonnection/RTCMultiConnection';

// utils
import { initialMessage } from '../../utils/constant';

// ----------------------------------------------------------------------

const QuitButton = styled(Button)({
  padding: 10,
  backgroundColor: 'rgb(5, 60, 92)',
  '&:hover': {
    backgroundColor: 'rgb(5, 50, 72)'
  }
});

const MessageBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    color: '#FFF',
    backgroundColor: '#FD001B'
  }
}));

export default function ConferenceControlMenu() {
  const setConference = useSetRecoilState(conferenceState); // 음성대화진행 유무 상태값
  const [isMute, setIsMute] = useRecoilState(muteState); // 음성대화 음소거 유무 상태값
  const [isChatActive, setIsChatActive] = useRecoilState(chatActiveState); // 대화방 채팅 UI 액티브 유무 상태값
  const { unReadMessageCount, setUnReadMessageCount, setMessageList, setDividerPosition } =
    useContext(MessageContext);

  // 음소거 활성화 or 비활성화
  const handleLocalMute = () => {
    setIsMute((isMute) => !isMute);
  };

  // 대화 초대할 유저 목록 표시
  const handleInviteUser = () => {
    // TODO: 대화 상대 초대
  };

  // 채팅창 활성화 or 비활성화
  const handleChatActive = () => {
    setIsChatActive((isActive) => !isActive);
    if (!isChatActive) {
      setDividerPosition(); // 채팅 비활성화 시 마지막 메시지 위치를 확인하기 위한 구분선 추가
    }
  };

  // 대화 종료(상태 변수값 초기화 및 연결해제 함수 호출)
  const handleQuitConference = () => {
    handleDisconnectRTC();
    setConference(false);
    setIsMute(false);
    setIsChatActive(false);
    setUnReadMessageCount(0);
    setMessageList([initialMessage]);
  };

  // 채팅창 활성화 될 경우 읽지않은 채팅메시지 카운트 0으로 리셋
  useEffect(() => {
    if (isChatActive) setUnReadMessageCount(0);
  }, [isChatActive, setUnReadMessageCount]);

  /**
   * mute / unmute 상태 변경
   * stream.mute 호출 시 연결된 유저들에게 로컬유저의 오디오 스트림이 전달되지 않음
   * extra 값은 대화방 초기 진입 시 mute or unmute상태 구분을 위해 설정
   */
  useEffect(() => {
    if (isMute) {
      connection.attachStreams.forEach((stream) => {
        stream.mute('audio');
        connection.extra.isMute = true;
        connection.updateExtraData();
      });
    } else {
      connection.attachStreams.forEach((stream) => {
        stream.unmute('audio');
        connection.extra.isMute = false;
        connection.updateExtraData();
      });
    }
  }, [isMute]);

  return (
    <Box sx={{ backgroundColor: '#dedee4', borderRadius: 2 }}>
      <Stack sx={{ p: 2 }} spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
          <IconButton
            aria-label="mute"
            color="ultramarine"
            onClick={handleLocalMute}
            sx={{ backgroundColor: isMute && '#F2F2F2' }}
          >
            <Box
              component={Icon}
              icon={isMute ? micOffOutline : micOutline}
              sx={{ width: 23, heigh: 23 }}
            />
          </IconButton>
          <IconButton aria-label="mute" color="ultramarine" onClick={handleInviteUser}>
            <Box component={Icon} icon={personAddOutline} sx={{ width: 23, heigh: 23 }} />
          </IconButton>
          <IconButton
            aria-label="mute"
            color="ultramarine"
            onClick={handleChatActive}
            sx={{ backgroundColor: isChatActive && '#F2F2F2' }}
          >
            <MessageBadge badgeContent={unReadMessageCount}>
              <Box
                component={Icon}
                icon={isChatActive ? MessageCircleFill : MessageCircleOutline}
                sx={{ width: 23, heigh: 23 }}
              />
            </MessageBadge>
          </IconButton>
        </Stack>
        <QuitButton variant="contained" onClick={handleQuitConference}>
          대화 종료
        </QuitButton>
      </Stack>
    </Box>
  );
}
