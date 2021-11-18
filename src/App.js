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
// ----------------------------------------------------------------------

export default function App() {
  return (
    <RecoilRoot>
      <ThemeConfig>
        <ToastContainer theme="colored" hideProgressBar style={{ fontSize: '12px' }} />
        <ScrollToTop />
        <Router />
      </ThemeConfig>
    </RecoilRoot>
  );
}
