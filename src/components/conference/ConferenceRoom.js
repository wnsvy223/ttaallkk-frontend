import { useEffect, useContext, useRef } from 'react';

// material ui
import { Stack, Box, Typography, Grow } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

// simplebar-react
import SimpleBarReact from 'simplebar-react';

// recoil
import { useRecoilValue } from 'recoil';
import { chatActiveState } from '../../recoil/atom';

// api
import connection from '../../api/rtcmulticonnection/RTCMultiConnection';

// context
import { ConnectionContext } from '../../api/context/ConnectionContext';

// component
import ConferenceParticipantsItem from './ConferenceParticipantsItem';
import ConferenceControlMenu from './ConferenceControlMenu';
import ConferenceChatBox from './ConferenceChatBox';
import ConferenceChatInput from './ConferenceChatInput';

const SimplebarStyle = styled(SimpleBarReact)(() => ({
  height: 500,
  padding: 10,
  marginTop: 5,
  borderRadius: 10,
  backgroundColor: '#dedee4'
}));

const ConferenceChatContainer = styled(Box)(() => ({
  background: 'linear-gradient(to right, #282828, #202020)',
  borderRadius: 15
}));

export default function ConferenceRoom() {
  const participantsRef = useRef({});
  const { participants } = useContext(ConnectionContext);
  const isChatActive = useRecoilValue(chatActiveState);

  useEffect(() => {
    // detect mute
    connection.onmute = (e) => {
      if (!e.mediaElement) {
        return;
      }

      if (e.muteType === 'both' || e.muteType === 'video') {
        // TODO: video & audio mute function
      } else if (e.muteType === 'audio') {
        e.mediaElement.muted = true;
        if (participantsRef?.current[e.userid]) {
          const item = participantsRef?.current[e.userid];
          item.style.filter = 'brightness(0.5)';
        }
      }
    };
  }, []);

  useEffect(() => {
    // detect unmute
    connection.onunmute = (e) => {
      if (!e.mediaElement) {
        return;
      }

      if (e.unmuteType === 'both' || e.unmuteType === 'video') {
        // TODO: video & audio unmute function
      } else if (e.unmuteType === 'audio') {
        e.mediaElement.muted = false;
        if (participantsRef?.current[e.userid]) {
          const item = participantsRef?.current[e.userid];
          item.style.filter = 'brightness(1)';
        }
      }
    };
  }, []);

  return (
    <Stack sx={{ p: 2, height: '90%' }} justifyContent="space-around" spacing={3}>
      <ConferenceControlMenu />
      <Box>
        <Grow in={isChatActive}>
          <Box sx={{ display: isChatActive ? 'block' : 'none', pb: 2 }}>
            <Box sx={{ pb: 1, pl: 1 }}>
              <Typography variant="h6">채팅</Typography>
            </Box>
            <ConferenceChatContainer>
              <ConferenceChatBox />
              <ConferenceChatInput />
            </ConferenceChatContainer>
          </Box>
        </Grow>
        <Grow in={!isChatActive}>
          <Box sx={{ display: isChatActive ? 'none' : 'block', pb: 2 }}>
            <Box sx={{ pb: 1, ml: 1 }}>
              <Typography variant="h6">대화방 참가자 ({participants?.length})</Typography>
            </Box>
            <SimplebarStyle>
              {participants.map((event) => (
                <Box
                  key={event?.userid}
                  ref={(element) => (participantsRef.current[event?.userid] = element)}
                  sx={{
                    filter: event?.extra?.isMute === true ? 'brightness(0.5)' : 'brightness(1)'
                  }}
                >
                  <ConferenceParticipantsItem event={event} />
                </Box>
              ))}
            </SimplebarStyle>
          </Box>
        </Grow>
      </Box>
    </Stack>
  );
}
