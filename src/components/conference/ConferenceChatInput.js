import { useState, useContext } from 'react';

// material ui
import { Box, IconButton, Paper, InputBase } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

import { Icon } from '@iconify/react';
import SendIcon from '@iconify/icons-mdi/send';

// Moment
import moment from 'moment';
import 'moment/locale/ko';

// api
import connection from '../../api/rtcmulticonnection/RTCMultiConnection';

// context
import { MessageContext } from '../../api/context/MessageContext';

// ----------------------------------------------------------------------

const ChatInputBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 10
}));

const ChatInputPaper = styled(Paper)(() => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  backgroundColor: '#505050'
}));

export default function ConferenceChatInput() {
  const [chatMessage, setChatMessage] = useState('');
  const { setMessageList } = useContext(MessageContext);

  const handleEnterPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleChange = (e) => {
    setChatMessage(e.target.value);
  };

  const handleSendMessage = () => {
    const newMessage = {
      type: 'textMessage',
      text: chatMessage,
      userid: connection.userid,
      displayName: connection.extra.displayName,
      profileUrl: connection.extra.profileUrl,
      timeStamp: moment()
    };
    connection.send(newMessage);
    setMessageList((message) => [...message, newMessage]);
    setChatMessage('');
  };

  return (
    <ChatInputBox>
      <ChatInputPaper>
        <InputBase
          sx={{ ml: 1, flex: 1, height: 40, fontSize: 12, color: '#F2F2F2' }}
          placeholder="채팅 메시지를 입력하세요."
          onChange={handleChange}
          onKeyPress={handleEnterPress}
          value={chatMessage || ''}
        />
        {chatMessage && (
          <IconButton onClick={handleSendMessage}>
            <Box component={Icon} icon={SendIcon} sx={{ width: 23, heigh: 23, color: '#F2F2F2' }} />
          </IconButton>
        )}
      </ChatInputPaper>
    </ChatInputBox>
  );
}
