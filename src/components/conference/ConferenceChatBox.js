/* eslint-disable no-nested-ternary */
import { useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';

// material ui
import { Stack, Box, Typography, Grow } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

// simplebar-react
import SimpleBarReact from 'simplebar-react';

// Moment
import Moment from 'react-moment';
import 'moment/locale/ko';

// api
import connection from '../../api/rtcmulticonnection/RTCMultiConnection';

// context
import { MessageContext } from '../../api/context/MessageContext';

// component
import LetterAvatar from '../common/LetterAvatar';

const SimplebarStyle = styled(SimpleBarReact)(() => ({
  height: 450,
  padding: 10,
  margin: '5px 5px 0px',
  '.simplebar-scrollbar::before ': {
    backgroundColor: '#F2F2F2'
  }
}));

const DisplayNameTextView = styled(Typography)(() => ({
  fontSize: '10px',
  fontWeight: 'bold',
  paddingBottom: 5,
  color: '#F2F2F2'
}));

// -------------------------------SystemMessage---------------------------------------

SystemMessageItem.propTypes = {
  data: PropTypes.object.isRequired
};

function SystemMessageItem({ data }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ pt: 5, pb: 5 }}>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          p: 0.5,
          backgroundColor: '#125e8a',
          color: '#F2F2F2',
          borderRadius: 2,
          width: '80%'
        }}
      >
        <Typography sx={{ fontSize: '12px', fontWeight: 'bold' }}>{data?.text}</Typography>
        <Typography noWrap sx={{ fontSize: { xs: 10, md: 5 }, color: '#F2F2F2' }}>
          <Moment format="YYYY년 MMMM Do dddd A h:mm:ss">{data?.timeStamp}</Moment>
        </Typography>
      </Stack>
    </Stack>
  );
}

// -------------------------------SendMessageItem---------------------------------------

SendMessageItem.propTypes = {
  data: PropTypes.object.isRequired
};

function SendMessageItem({ data }) {
  return (
    <Grow in timeout={600}>
      <Stack direction="row" justifyContent="right" spacing={1} sx={{ pt: 1, pb: 1 }}>
        <Stack direction="row" alignItems="flex-end">
          <Typography noWrap sx={{ fontSize: { xs: 10, md: 5 }, color: 'GrayText' }}>
            <Moment fromNow>{data?.timeStamp}</Moment>
          </Typography>
        </Stack>
        <Box
          sx={{
            backgroundColor: '#505050',
            color: '#F2F2F2',
            p: 1.5,
            borderRadius: 2,
            minWidth: 150,
            maxWidth: '80%',
            boxShadow: 1
          }}
        >
          <Typography sx={{ fontSize: '12px', wordWrap: 'break-word' }}>{data?.text}</Typography>
        </Box>
      </Stack>
    </Grow>
  );
}

// -------------------------------ReceiveMessageItem---------------------------------------

ReceiveMessageItem.propTypes = {
  data: PropTypes.object.isRequired
};

function ReceiveMessageItem({ data }) {
  return (
    <Grow in timeout={600}>
      <Stack
        direction="row"
        justifyContent="left"
        spacing={1}
        sx={{ pt: 1, pb: 1, maxWidth: '90%' }}
      >
        <LetterAvatar
          src={data?.profileUrl}
          sx={{
            width: 32,
            height: 32,
            name: data?.displayName,
            fontSize: 12
          }}
        />
        <Stack sx={{ minWidth: 150, maxWidth: '80%' }}>
          <DisplayNameTextView>{data?.displayName}</DisplayNameTextView>
          <Box
            sx={{
              backgroundColor: '#FCEC4F',
              color: 'black',
              p: 1.5,
              borderRadius: 2,
              boxShadow: 1
            }}
          >
            <Typography sx={{ fontSize: '12px', wordWrap: 'break-word' }}>{data?.text}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" alignItems="flex-end">
          <Typography noWrap sx={{ fontSize: { xs: 10, md: 5 }, color: 'GrayText' }}>
            <Moment fromNow>{data?.timeStamp}</Moment>
          </Typography>
        </Stack>
      </Stack>
    </Grow>
  );
}

// ----------------------------------------------------------------------

export default function ConferenceChatBox() {
  const simplebarRef = useRef();
  const scrollRef = useRef();
  const { messageList } = useContext(MessageContext);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: 'smooth' });
    }
  };

  // 메시지 추가 시 스크롤 최하단 이동
  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  return (
    <SimplebarStyle ref={simplebarRef}>
      {messageList?.length > 0 &&
        messageList?.map((data, index) => (
          <Box key={index} ref={scrollRef}>
            {data?.type === 'systemMessage' ? (
              <SystemMessageItem data={data} />
            ) : data?.userid === connection?.userid ? (
              <SendMessageItem data={data} />
            ) : (
              <ReceiveMessageItem data={data} />
            )}
          </Box>
        ))}
    </SimplebarStyle>
  );
}
