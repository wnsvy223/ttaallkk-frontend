/* eslint-disable no-nested-ternary */
import { useEffect, useContext, useRef } from 'react';
import PropTypes from 'prop-types';

// material ui
import {
  Stack,
  Box,
  Typography,
  Grow,
  Divider,
  LinearProgress,
  linearProgressClasses,
  Link,
  IconButton,
  CardMedia
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

// simplebar-react
import SimpleBarReact from 'simplebar-react';

// Moment
import Moment from 'react-moment';
import 'moment/locale/ko';

// iconify
import { Icon } from '@iconify/react';
import DownLoad from '@iconify/icons-mdi/download';

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

const UnReadMessageDivider = styled(Divider)(() => ({
  color: '#FFF',
  padding: '40px 0px',
  fontSize: 12
}));

const FileMessageWrapper = styled(Box)(() => ({
  width: '100%',
  height: '100%',
  textAlign: 'center',
  borderRadius: 10,
  backgroundColor: '#FFF',
  padding: 20,
  margin: 10
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  margin: 10,
  padding: 3,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'
  }
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
  const { file } = useContext(MessageContext);

  return (
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
        <Typography
          sx={{
            fontSize: '12px',
            wordWrap: 'break-word',
            textAlign: data?.file ? 'center' : 'initial'
          }}
        >
          {data?.text}
        </Typography>
        {data?.file && data?.file?.uuid === file?.uuid && data?.file?.end !== true && (
          <ProgressBar
            variant="determinate"
            value={(file?.currentPosition * 100) / file?.maxChunks}
          />
        )}
        {data?.file && data?.file?.end === true && (
          <Stack alignItems="center" justifyContent="center">
            <FileMessageWrapper>
              {data?.file?.type.indexOf('image') !== -1 && (
                <CardMedia component="img" image={data?.file?.url} alt="image file" />
              )}
              <Link
                href={data?.file?.url}
                target="_blank"
                rel="noreferrer"
                download={data?.file?.name}
                underline="hover"
                sx={{ fontSize: 12, textAlign: 'center' }}
              >
                <IconButton sx={{ fontSize: 20 }}>
                  <Box
                    component={Icon}
                    icon={DownLoad}
                    sx={{ width: 23, heigh: 23, color: 'gray' }}
                  />
                </IconButton>
              </Link>
            </FileMessageWrapper>
          </Stack>
        )}
      </Box>
    </Stack>
  );
}

// -------------------------------ReceiveMessageItem---------------------------------------

ReceiveMessageItem.propTypes = {
  data: PropTypes.object.isRequired
};

function ReceiveMessageItem({ data }) {
  const { file } = useContext(MessageContext);

  return (
    <Stack direction="row" justifyContent="left" spacing={1} sx={{ pt: 1, pb: 1, maxWidth: '90%' }}>
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
          <Typography
            sx={{
              fontSize: '12px',
              wordWrap: 'break-word',
              textAlign: data?.file ? 'center' : 'initial'
            }}
          >
            {data?.text}
          </Typography>
          {data?.file && data?.file?.uuid === file?.uuid && data?.file?.end !== true && (
            <ProgressBar
              variant="determinate"
              value={(file?.currentPosition * 100) / file?.maxChunks}
            />
          )}
          {data?.file && data?.file?.end === true && (
            <Stack alignItems="center" justifyContent="center">
              <FileMessageWrapper>
                {data?.file?.type.indexOf('image') !== -1 && (
                  <CardMedia component="img" image={data?.file?.url} alt="image file" />
                )}
                <Link
                  href={data?.file?.url}
                  target="_blank"
                  rel="noreferrer"
                  download={data?.file?.name}
                  underline="hover"
                  sx={{ fontSize: 12, textAlign: 'center' }}
                >
                  <IconButton sx={{ fontSize: 20 }}>
                    <Box
                      component={Icon}
                      icon={DownLoad}
                      sx={{ width: 23, heigh: 23, color: 'gray' }}
                    />
                  </IconButton>
                </Link>
              </FileMessageWrapper>
            </Stack>
          )}
        </Box>
      </Stack>
      <Stack direction="row" alignItems="flex-end">
        <Typography noWrap sx={{ fontSize: { xs: 10, md: 5 }, color: 'GrayText' }}>
          <Moment fromNow>{data?.timeStamp}</Moment>
        </Typography>
      </Stack>
    </Stack>
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
          <Grow key={index} in timeout={600}>
            <Box ref={scrollRef}>
              {data?.type === 'systemMessage' ? (
                data?.isDividerMessage === true ? (
                  <UnReadMessageDivider
                    sx={{
                      display: index === 0 || index === messageList.length - 1 ? 'none' : 'flex'
                    }}
                  >
                    여기까지 읽었습니다.
                  </UnReadMessageDivider>
                ) : (
                  <SystemMessageItem data={data} />
                )
              ) : data?.userid === connection?.userid ? (
                <SendMessageItem data={data} />
              ) : (
                <ReceiveMessageItem data={data} />
              )}
            </Box>
          </Grow>
        ))}
    </SimplebarStyle>
  );
}
