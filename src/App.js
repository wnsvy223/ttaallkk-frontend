import React from 'react';

// recoil
import { RecoilRoot } from 'recoil';

// toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// theme
import ThemeConfig from './theme';

// routes
import Router from './routes';

// components
import ScrollToTop from './components/ScrollToTop';
import FcmNotification from './components/authentication/notification/FcmNotification';
import AuthSession from './components/authentication/session/AuthSession';

// rtcmulticonnection context
import { ConnectionProvider } from './api/context/ConnectionContext';
import { MessageProvider } from './api/context/MessageContext';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <RecoilRoot>
      <ConnectionProvider>
        <MessageProvider>
          <ThemeConfig>
            <ToastContainer
              theme="colored"
              hideProgressBar
              limit={3}
              style={{ fontSize: '12px' }}
            />
            <ScrollToTop />
            <Router />
            <FcmNotification />
            <AuthSession />
          </ThemeConfig>
        </MessageProvider>
      </ConnectionProvider>
    </RecoilRoot>
  );
}
