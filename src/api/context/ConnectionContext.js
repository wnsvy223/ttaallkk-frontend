import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import useStream from '../../hook/useStream';

export const ConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {
  const { participants } = useStream(); // 대화참가자 상태변화를 위한 커스텀 훅
  return (
    <ConnectionContext.Provider value={{ participants }}>{children}</ConnectionContext.Provider>
  );
};

ConnectionProvider.propTypes = {
  children: PropTypes.object
};
