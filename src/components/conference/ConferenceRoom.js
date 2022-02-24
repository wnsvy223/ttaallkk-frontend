import { useEffect, useContext, useRef } from 'react';

// material ui
import { Stack, Box, Typography } from '@material-ui/core';

// simplebar-react
import SimpleBarReact from 'simplebar-react';

// api
import connection from '../../api/rtcmulticonnection/RTCMultiConnection';

// context
import { ConnectionContext } from '../../api/context/ConnectionContext';

// component
import ConferenceParticipantsItem from './ConferenceParticipantsItem';
import ConferenceControlMenu from './ConferenceControlMenu';

export default function ConferenceRoom() {
  const participantsRef = useRef({});
  const { participants } = useContext(ConnectionContext);

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
    <Stack sx={{ p: 2, height: '90%' }} spacing={3}>
      <ConferenceControlMenu />
      <Typography variant="h6">대화방 참가자 ({participants?.length})</Typography>
      <SimpleBarReact style={{ height: '70%' }}>
        {participants.map((event) => (
          <Box
            key={event?.userid}
            ref={(element) => (participantsRef.current[event?.userid] = element)}
            sx={{ filter: event?.extra?.isMute === true ? 'brightness(0.5)' : 'brightness(1)' }}
          >
            <ConferenceParticipantsItem event={event} />
          </Box>
        ))}
      </SimpleBarReact>
    </Stack>
  );
}
