import { useState } from 'react';

// material ui
import { styled } from '@material-ui/core/styles';
import { Stack, TextField, Button, Checkbox, FormGroup, FormControlLabel } from '@material-ui/core';

// toast
import { toast } from 'react-toastify';

// redux
import { useSelector } from 'react-redux';

// recoil
import { useSetRecoilState } from 'recoil';
import { conferenceState, conferenceLoadingState } from '../../recoil/atom';

// api
import connection from '../../api/rtcmulticonnection/RTCMultiConnection';

const ConferenceButton = styled(Button)({
  backgroundColor: 'rgb(5, 60, 92)',
  '&:hover': {
    backgroundColor: 'rgb(5, 50, 72)'
  }
});

export default function ConferenceForm() {
  const user = useSelector((store) => store.auth.user);

  const [username, setUserName] = useState('');
  const [roomname, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [isPublicRoom, setIsPublicRoom] = useState(false);
  const setConference = useSetRecoilState(conferenceState); // 음성대화진행 유무 상태값
  const setConferenceLoading = useSetRecoilState(conferenceLoadingState); // 음성대화 로딩 상태값

  const handleOpenRoom = () => {
    if (roomname === '') {
      toast.info('방이름을 입력하세요.', {
        position: toast.POSITION.TOP_CENTER
      });
    } else if (!isPublicRoom && password === '') {
      toast.info('비밀번호를 입력하세요.', {
        position: toast.POSITION.TOP_CENTER
      });
    } else if (!user && username === '') {
      toast.info('닉네임을 입력하세요.', {
        position: toast.POSITION.TOP_CENTER
      });
    } else {
      setConferenceLoading(true);
      openConference();
    }
  };

  // 방 생성
  const openConference = () => {
    connection.extra = {
      displayName: user ? user?.displayName : username, // 대화방 닉네임
      uid: user ? user?.uid : connection?.userid
    };
    connection.checkPresence(roomname, (isRoomExist, roomid) => {
      if (isRoomExist === true) {
        toast.error(`${roomid} 방이 이미 존재합니다.`, {
          position: toast.POSITION.TOP_CENTER
        });
        handleDisconnectConference();
      } else if (isPublicRoom) {
        // 공개방
        connection.password = null; // 공개방은 비밀번호값 설정X
        connection.publicRoomIdentifier = 'publicRoomIdentifier'; // 공개방을 구분하기 위한 세팅값
        connection.open(roomname, (isRoomOpened, roomName, error) => {
          if (isRoomOpened && !error) {
            console.log(`방 생성 완료(공개방) : ${roomName}`);
            setConference(true);
            setConferenceLoading(false);
          } else {
            console.log(`방 생성 오류(공개방) : ${error}`);
            handleDisconnectConference();
          }
        });
      } else {
        // 비공개방
        connection.password = password; // 비밀번호
        connection.publicRoomIdentifier = roomname; // 비공개 방은 방 구분자를 방 제목으로 하여 조회 하도록 함.
        connection.open(roomname, (isRoomOpened, roomName, error) => {
          if (isRoomOpened && !error) {
            console.log(`방 생성 완료(비공개방) : ${roomName}`);
            setConference(true);
            setConferenceLoading(false);
          } else {
            console.log(`방 생성 오류(비공개방) : ${error}`);
            handleDisconnectConference();
          }
        });
      }
    });
  };

  const handleJoinRoom = () => {
    if (roomname === '') {
      toast.info('방이름을 입력하세요.', {
        position: toast.POSITION.TOP_CENTER
      });
    } else if (!isPublicRoom && password === '') {
      toast.info('비밀번호를 입력하세요.', {
        position: toast.POSITION.TOP_CENTER
      });
    } else if (!user && username === '') {
      toast.info('닉네임을 입력하세요.', {
        position: toast.POSITION.TOP_CENTER
      });
    } else {
      joinConference();
      setConferenceLoading(true);
    }
  };

  // 방 참가
  const joinConference = () => {
    connection.extra = {
      displayName: user ? user?.displayName : username, // 대화방 닉네임
      uid: user ? user?.uid : connection?.userid
    };
    connection.checkPresence(roomname, (isRoomExist, roomid, extra) => {
      if (isRoomExist === true) {
        // 공개방
        if (isPublicRoom) {
          // 공개방 체크박스 체크 후, 참가하려는 방이 비밀번호가 설정된 방일 경우 비밀번호 입력요구 경고창 호출.
          if (extra._room.isPasswordProtected) {
            toast.error(`${roomid} 방은 비밀번호가 설정된 방입니다. 비밀번호를 입력하세요.`, {
              position: toast.POSITION.TOP_CENTER
            });
            handleDisconnectConference();
          } else {
            connection.join(roomname, (isRoomJoined, roomName, error) => {
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
                console.log('참가 성공(공개방)');
                setConference(true);
                setConferenceLoading(false);
              }
            });
          }
        } else {
          connection.password = password;
          connection.join(roomname, (isJoinedRoom, roomName, error) => {
            if (error) {
              handleDisconnectConference();
              switch (error) {
                case 'Invalid password':
                  toast.error('비밀번호가 틀립니다.', {
                    position: toast.POSITION.TOP_CENTER
                  });
                  break;
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
              console.log('참가성공(비공개방)');
              setConference(true);
              setConferenceLoading(false);
            }
          });
        }
      } else {
        toast.error('생성된 방이 없습니다.', {
          position: toast.POSITION.TOP_CENTER
        });
      }
    });
  };

  // 닉네임 입력창 제어함수
  const handleChangeUserName = (userName) => {
    setUserName(userName);
  };

  // 방이름 입력창 제어함수
  const handleChangeRoomName = (name) => {
    setRoomName(name);
  };

  // 비밀번호 입력창 제어함수
  const handleChangePassword = (password) => {
    setPassword(password);
  };

  // 공개방 체크박스 제어함수
  const handleChangeCheckBox = () => {
    setIsPublicRoom(!isPublicRoom);
    setPassword('');
  };

  // 음성대화 연결해제 제어함수
  const handleDisconnectConference = () => {
    connection.isInitiator = false; // 대화종료 시 방장구분값 false로 초기화
    connection.closeSocket();
    // 소켓 닫음(소켓에 연결된 유저가 없을 경우 방 사라짐. 소켓에 연결된 유저 한명이라도 있을 경우 방 재접속 가능).
    connection.attachStreams.forEach((stream) => {
      stream.stop(); // 미디어 스트림 제거
    });
    connection.getAllParticipants().forEach((pid) => {
      connection.disconnectWith(pid);
    });
    setConference(false);
    setConferenceLoading(false);
  };

  return (
    <Stack sx={{ p: 2 }} spacing={2} alignItems="center">
      {!user && (
        <TextField
          label="닉네임"
          type="text"
          variant="outlined"
          fullWidth
          size="small"
          onChange={(e) => handleChangeUserName(e.target.value)}
          value={username}
          color="ultramarine"
          inputProps={{ style: { textAlign: 'center' } }}
        />
      )}

      <TextField
        label="방 제목"
        type="text"
        variant="outlined"
        fullWidth
        size="small"
        onChange={(e) => handleChangeRoomName(e.target.value)}
        value={roomname}
        color="ultramarine"
        inputProps={{ style: { textAlign: 'center' } }}
      />
      <TextField
        label={isPublicRoom ? '공개방입니다' : '비밀번호'}
        type="password"
        variant="outlined"
        fullWidth
        size="small"
        onChange={(e) => handleChangePassword(e.target.value)}
        value={password}
        color="ultramarine"
        disabled={isPublicRoom}
        inputProps={{ style: { textAlign: 'center' } }}
      />
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox checked={isPublicRoom} onChange={handleChangeCheckBox} color="ultramarine" />
          }
          label="공개방"
        />
      </FormGroup>
      <Stack direction="row" spacing={2}>
        <ConferenceButton variant="contained" onClick={handleOpenRoom}>
          방 생성
        </ConferenceButton>
        <ConferenceButton variant="contained" onClick={handleJoinRoom}>
          방 참가
        </ConferenceButton>
      </Stack>
    </Stack>
  );
}
