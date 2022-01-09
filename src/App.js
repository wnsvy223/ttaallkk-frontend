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
            <ToastContainer theme="colored" hideProgressBar style={{ fontSize: '12px' }} />
            <ScrollToTop />
            <Router />
          </ThemeConfig>
        </MessageProvider>
      </ConnectionProvider>
    </RecoilRoot>
  );
}
