import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import useMessage from '../../hook/useMessage';

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  // 대화참가자의 대화상태및 채팅메시지 상태변화를 위한 커스텀 훅
  const {
    speak,
    messageList,
    setMessageList,
    unReadMessageCount,
    setUnReadMessageCount,
    findDividerItem,
    setDividerPosition,
    resetDividerPosition
  } = useMessage();

  return (
    <MessageContext.Provider
      value={{
        speak,
        messageList,
        setMessageList,
        unReadMessageCount,
        setUnReadMessageCount,
        findDividerItem,
        setDividerPosition,
        resetDividerPosition
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

MessageProvider.propTypes = {
  children: PropTypes.object
};
