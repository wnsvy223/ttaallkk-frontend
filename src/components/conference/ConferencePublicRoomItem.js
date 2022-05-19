import PropTypes from 'prop-types';

import { useState, useEffect } from 'react';

// material ui
import { Typography, Stack, Button, Box, CardMedia, TextField } from '@material-ui/core';

// toastify
import { toast } from 'react-toastify';

// iconify
import { Icon } from '@iconify/react';
import imageFill from '@iconify/icons-eva/image-fill';

// redux
import { useSelector } from 'react-redux';

// recoil
import { useSetRecoilState } from 'recoil';
import { conferenceState, conferenceLoadingState } from '../../recoil/atom';

// api
import connection, { handleDisconnectRTC } from '../../api/rtcmulticonnection/RTCMultiConnection';

// component
import AlertDialog from '../common/AlertDialog';

// ----------------------------------------------------------------------

ConferencePublicRoomItem.propTypes = {
  room: PropTypes.object
};

export default function ConferencePublicRoomItem({ room }) {
  const { sessionid, maxParticipantsAllowed, participants, imageUrl } = room;

  const [openDialog, setOpenDialog] = useState(false);
  const [anonymousDisplayName, setAnonymousDisplayName] = useState('');
  const [participantsNum, setParticipantsNum] = useState(0);

  const user = useSelector((store) => store.auth.user);
  const setConference = useSetRecoilState(conferenceState); // 음성대화진행 유무 상태값
  const setConferenceLoading = useSetRecoilState(conferenceLoadingState); // 음성대화 로딩 상태값

  const handleDialogSubmit = (displayName) => {
    if (displayName === '') {
      toast.error('닉네임을 입력하세요.', {
        position: toast.POSITION.TOP_CENTER
      });
    } else {
      connection.extra = {
        displayName,
        profileUrl: '',
        uid: connection?.userid
      };
      handleJoinPublicRoom(sessionid);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setAnonymousDisplayName('');
  };

  const handleChangeTextField = (e) => {
    setAnonymousDisplayName(e.target.value);
  };

  const handleDisconnectConference = () => {
    handleDisconnectRTC();
    setConference(false);
    setConferenceLoading(false);
  };

  const handleCheckAuth = () => {
    if (user) {
      connection.extra = {
        displayName: user?.displayName,
        profileUrl: user?.profileUrl,
        uid: user?.uid
      };
      handleJoinPublicRoom(sessionid);
    } else {
      setOpenDialog(true);
    }
  };

  const handleJoinPublicRoom = (room) => {
    connection.checkPresence(room, (isRoomExist) => {
      if (isRoomExist === true) {
        connection.join(room, (isRoomJoined, roomName, error) => {
          if (error) {
            handleDisconnectConference();
            switch (error) {
              case 'Room not available':
                toast.error('사용할 수 없는 방입니다.', {
                  position: toast.POSITION.TOP_CENTER
                });
                break;
              case 'Room full':
                toast.error('인원수가 초과되었습니다.', {
                  position: toast.POSITION.TOP_CENTER
                });
                break;
              default:
            }
          } else {
            setConference(true);
            console.log('참가 성공(공개방)');
          }
        });
      } else {
        toast.error('생성된 방이 없습니다.', {
          position: toast.POSITION.TOP_CENTER
        });
      }
    });
  };

  // props로 넘어온 방 참가 인원수 세팅
  useEffect(() => {
    if (participants) {
      setParticipantsNum(participants?.length);
    }
    return () => {
      setParticipantsNum(0);
    };
  }, [participants]);

  // 시그널링 서버로부터 넘어온 실시간 방 변경 데이터에서 방 참가 인원수 세팅
  useEffect(() => {
    connection.getSocket((socket) => {
      socket.on('public-room-changed', (room) => {
        if (room?.sessionid === sessionid) {
          setParticipantsNum(room?.participants?.length);
        }
      });
    });
    return () => {
      setParticipantsNum(0);
    };
  }, [sessionid]);

  return (
    <Box
      sx={{
        m: 2,
        p: 1,
        backgroundColor: 'background.neutral',
        borderRadius: 2,
        boxShadow: '1px 1px 3px 1px #dadce0 inset'
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {imageUrl ? (
          <CardMedia
            component="img"
            image={imageUrl}
            alt="room image"
            sx={{ width: 50, height: 50, borderRadius: 1 }}
          />
        ) : (
          <Box
            component={Icon}
            icon={imageFill}
            sx={{
              width: 40,
              height: 40,
              color: 'GrayText'
            }}
          />
        )}
        <Typography variant="subtitle1">{`방 제목 : ${sessionid}`}</Typography>
        <Typography variant="subtitle2" noWrap>
          {`${participantsNum} / ${maxParticipantsAllowed}`}
        </Typography>
        <Button variant="contained" color="info" onClick={handleCheckAuth}>
          참가
        </Button>
      </Stack>
      {openDialog && (
        <AlertDialog
          element={{ title: '익명 사용자' }}
          open={openDialog}
          onDialogClose={handleDialogClose}
          onDialogSubmit={() => handleDialogSubmit(anonymousDisplayName)}
          children={
            <Box>
              <TextField
                autoFocus
                margin="dense"
                id="displayname"
                label="닉네임을 입력하세요"
                type="text"
                fullWidth
                variant="standard"
                color="info"
                onChange={handleChangeTextField}
                value={anonymousDisplayName}
              />
            </Box>
          }
          dialogContentStyle={{ width: 250 }}
        />
      )}
    </Box>
  );
}
