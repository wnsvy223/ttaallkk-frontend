import { useState } from 'react';

import PropTypes from 'prop-types';

// material ui
import { styled } from '@material-ui/core/styles';
import { Stack, TextField, Box } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';

// toast
import { toast } from 'react-toastify';

// redux
import { useSelector } from 'react-redux';

// recoil
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  conferenceState,
  conferenceLoadingState,
  chatOnlyModeState,
  participantListState
} from '../../recoil/atom';

// api
import connection, {
  handleDisconnectRTC,
  handleMaxParticipantsAllowed,
  detectAudioInput,
  applyChatOnlyMode,
  applyDefaultMediaMode,
  setLastOpenOrJoin
} from '../../api/rtcmulticonnection/RTCMultiConnection';

// utils
import { publicRoomIdentifier } from '../../utils/constant';

// components
import ConferenceParticipantsSlider from './ConferecParticipantsSlider';

ConferenceForm.propTypes = {
  isPublicRoom: PropTypes.bool
};

const ConferenceFormBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center'
});

const ConferenceButton = styled(LoadingButton)({
  backgroundColor: 'rgb(5, 60, 92)',
  '&:hover': {
    backgroundColor: 'rgb(5, 50, 72)'
  }
});

export default function ConferenceForm({ isPublicRoom }) {
  const user = useSelector((store) => store.auth.user);

  const [username, setUserName] = useState('');
  const [roomname, setRoomName] = useState('');
  const [password, setPassword] = useState('');

  const setConference = useSetRecoilState(conferenceState); // 음성대화진행 유무 상태값
  const [isConferenceLoading, setConferenceLoading] = useRecoilState(conferenceLoadingState); // 음성대화 로딩 상태값
  const setChatOnlyMode = useSetRecoilState(chatOnlyModeState); // 마이크 없음 → 채팅 전용 모드 상태값
  const setParticipants = useSetRecoilState(participantListState); // 참가자 목록 상태값

  // 로컬 사용자를 참가자 목록에 수동으로 등록 (채팅 전용 모드 시 onstream이 발생하지 않음)
  const addSelfToParticipants = () => {
    const selfEvent = {
      userid: connection.userid,
      extra: { ...(connection.extra || {}) }, // 동결 방지 얕은 복사
      type: 'local'
    };
    setParticipants((prev) => {
      if (prev.some((p) => p.userid === selfEvent.userid)) return prev;
      return [...prev, selfEvent];
    });
  };

  // open/join 직전에 마이크 장치 유무를 확인하여 세션을 조정
  const prepareMediaSession = async () => {
    const hasAudio = await detectAudioInput();
    if (hasAudio) {
      applyDefaultMediaMode();
      setChatOnlyMode(false);
    } else {
      applyChatOnlyMode();
      setChatOnlyMode(true);
      toast.info('마이크 장치를 찾을 수 없어 채팅 전용 모드로 참가합니다.', {
        position: toast.POSITION.TOP_CENTER
      });
    }
  };

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
  const openConference = async () => {
    connection.extra = {
      displayName: user ? user?.displayName : username, // 대화방 닉네임
      profileUrl: user ? user?.profileUrl : '', // 프로필 이미지
      uid: user ? user?.uid : connection?.userid
    };
    await prepareMediaSession();
    connection.checkPresence(roomname, (isRoomExist, roomid) => {
      if (isRoomExist === true) {
        toast.error(`${roomid} 방이 이미 존재합니다.`, {
          position: toast.POSITION.TOP_CENTER
        });
        handleDisconnectConference();
      } else if (isPublicRoom) {
        // 공개방
        connection.password = null; // 공개방은 비밀번호값 설정X
        connection.publicRoomIdentifier = publicRoomIdentifier; // 공개방을 구분하기 위한 세팅값
        const openPublic = () =>
          connection.open(roomname, (isRoomOpened, roomName, error) => {
            if (isRoomOpened && !error) {
              console.log(`방 생성 완료(공개방) : ${roomName}`);
              setConference(true);
              setConferenceLoading(false);
              addSelfToParticipants();
            } else {
              console.log(`방 생성 오류(공개방) : ${error}`);
              handleDisconnectConference();
            }
          });
        setLastOpenOrJoin(() => {
          setChatOnlyMode(true);
          toast.info('마이크 사용이 불가하여 채팅 전용 모드로 재연결합니다.', {
            position: toast.POSITION.TOP_CENTER
          });
          openPublic();
        });
        openPublic();
      } else {
        // 비공개방
        connection.password = password; // 비밀번호
        connection.publicRoomIdentifier = roomname; // 비공개 방은 방 구분자를 방 제목으로 하여 조회 하도록 함.
        const openPrivate = () =>
          connection.open(roomname, (isRoomOpened, roomName, error) => {
            if (isRoomOpened && !error) {
              console.log(`방 생성 완료(비공개방) : ${roomName}`);
              setConference(true);
              setConferenceLoading(false);
              addSelfToParticipants();
            } else {
              console.log(`방 생성 오류(비공개방) : ${error}`);
              handleDisconnectConference();
            }
          });
        setLastOpenOrJoin(() => {
          setChatOnlyMode(true);
          toast.info('마이크 사용이 불가하여 채팅 전용 모드로 재연결합니다.', {
            position: toast.POSITION.TOP_CENTER
          });
          openPrivate();
        });
        openPrivate();
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
  const joinConference = async () => {
    connection.extra = {
      displayName: user ? user?.displayName : username, // 대화방 닉네임
      profileUrl: user ? user?.profileUrl : '', // 프로필 이미지
      uid: user ? user?.uid : connection?.userid
    };
    await prepareMediaSession();
    connection.checkPresence(roomname, (isRoomExist, roomid, extra) => {
      if (isRoomExist === true) {
        // 공개방
        if (isPublicRoom) {
          // 공개방 체크박스 체크 후, 참가하려는 방이 비밀번호가 설정된 방일 경우 비밀번호 입력요구 경고창 호출.
          if (extra._room.isPasswordProtected) {
            handleDisconnectConference();
            toast.error(`${roomid} 방은 비밀번호가 설정된 방입니다. 비밀번호를 입력하세요.`, {
              position: toast.POSITION.TOP_CENTER
            });
          } else {
            const joinPublic = () =>
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
                  addSelfToParticipants();
                }
              });
            setLastOpenOrJoin(() => {
              setChatOnlyMode(true);
              toast.info('마이크 사용이 불가하여 채팅 전용 모드로 재연결합니다.', {
                position: toast.POSITION.TOP_CENTER
              });
              joinPublic();
            });
            joinPublic();
          }
        } else {
          connection.password = password;
          const joinPrivate = () =>
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
                addSelfToParticipants();
              }
            });
          setLastOpenOrJoin(() => {
            setChatOnlyMode(true);
            toast.info('마이크 사용이 불가하여 채팅 전용 모드로 재연결합니다.', {
              position: toast.POSITION.TOP_CENTER
            });
            joinPrivate();
          });
          joinPrivate();
        }
      } else {
        handleDisconnectConference();
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

  // 음성대화 연결해제 제어함수
  const handleDisconnectConference = () => {
    handleDisconnectRTC();
    setConference(false);
    setConferenceLoading(false);
    setChatOnlyMode(false);
    setParticipants([]);
  };

  // 인원수 제한 슬라이더 제어함수
  const onSetSliderValue = (participants) => {
    handleMaxParticipantsAllowed(participants);
  };

  return (
    <ConferenceFormBox>
      <Stack sx={{ p: 2 }} spacing={2} justifyContent="center">
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
        {!isPublicRoom && (
          <TextField
            label="비밀번호"
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
        )}
        <ConferenceParticipantsSlider onSetSliderValue={onSetSliderValue} />
        <Stack direction="row" spacing={2} justifyContent="center">
          <ConferenceButton
            variant="contained"
            onClick={handleOpenRoom}
            loading={isConferenceLoading}
          >
            생성
          </ConferenceButton>
          <ConferenceButton
            variant="contained"
            onClick={handleJoinRoom}
            loading={isConferenceLoading}
          >
            참가
          </ConferenceButton>
        </Stack>
      </Stack>
    </ConferenceFormBox>
  );
}
