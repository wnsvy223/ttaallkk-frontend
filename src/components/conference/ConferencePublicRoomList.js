import { useState, useEffect } from 'react';

// material
import { styled } from '@material-ui/core/styles';
import { Typography, Box, Stack } from '@material-ui/core';

// components
import ConferencePublicRoomItem from './ConferencePublicRoomItem';

// api
import connection from '../../api/rtcmulticonnection/RTCMultiConnection';

// utils
import { publicRoomIdentifier } from '../../utils/constant';
// ----------------------------------------------------------------------

const EmptyRoomMessageBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100vh'
});

export default function ConferencePublicRoomList() {
  const [publicRooms, setPublicRooms] = useState([]);

  // 공개방 컴포넌트 랜더링 시 공개방 데이터 세팅
  useEffect(() => {
    connection.getSocket((socket) => {
      socket.emit('get-public-rooms', publicRoomIdentifier, (listOfRooms) => {
        setPublicRooms(listOfRooms);
      });
    });
    return () => {
      setPublicRooms([]);
    };
  }, []);

  // 실시간 소켓이벤트로 공개방 생성 및 삭제 이벤트를 캐치하여 공개방 데이터 세팅
  useEffect(() => {
    connection.getSocket((socket) => {
      socket.on('get-current-public-rooms', (rooms) => {
        setPublicRooms(rooms);
      });
    });
    return () => {
      // 컴포넌트 언마운트 시 공개대화방 배열 비우고, 소켓 이벤트 리스너 해제
      setPublicRooms([]);
      connection.getSocket((socket) => {
        socket.removeListener('get-current-public-rooms');
      });
    };
  }, []);

  return (
    <Box>
      {publicRooms?.length <= 0 && (
        <EmptyRoomMessageBox>
          <Typography>진행중인 공개 대화방이 없습니다.</Typography>
        </EmptyRoomMessageBox>
      )}
      {publicRooms?.map((room) => (
        <Stack key={room?.sessionid}>
          <ConferencePublicRoomItem room={room} />
        </Stack>
      ))}
    </Box>
  );
}
