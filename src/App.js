// recoil
import { RecoilRoot } from 'recoil';
// routes
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Router from './routes';
// theme
import ThemeConfig from './theme';
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
