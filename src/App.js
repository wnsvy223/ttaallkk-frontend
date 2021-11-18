import React, { Suspense, lazy } from 'react';

// recoil
import { RecoilRoot } from 'recoil';

// routes
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// theme
import ThemeConfig from './theme';

// components
import ScrollToTop from './components/ScrollToTop';
import DashBoardSkeleton from './components/skeleton/DashBoardSkeleton';
import ErrorBoundary from './components/common/ErrorBoundary';

// ----------------------------------------------------------------------
const Router = lazy(() => import('./routes'));

export default function App() {
  return (
    <RecoilRoot>
      <ThemeConfig>
        <ToastContainer theme="colored" hideProgressBar style={{ fontSize: '12px' }} />
        <ScrollToTop />
        <ErrorBoundary>
          <Suspense fallback={<DashBoardSkeleton />}>
            <Router />
          </Suspense>
        </ErrorBoundary>
      </ThemeConfig>
    </RecoilRoot>
  );
}
