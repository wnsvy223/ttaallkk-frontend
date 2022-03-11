import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled, useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';

// recoil
import { useRecoilValue } from 'recoil';
import { conferenceState } from '../../recoil/atom';

// components
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import DashboardSideSheet from './DashboardSideSheet';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false); // 좌측 사이드바 open 상태
  const [openSheet, setOpenSheet] = useState(false); // 우측 사이드바 open 상태
  const [mini, setMini] = useState(false); // 좌측 사이드바 Mini Drawer 상태

  const isOnAir = useRecoilValue(conferenceState); // 음성대화 전역 상태값

  const handleChangeMiniSidebar = () => {
    setMini((prev) => !prev);
  };

  // 음성대화 진행중일 경우에 따라 우측 사이드바 음성대화 인터페이스 조건부 랜더링
  useEffect(() => {
    if (isOnAir) {
      setOpenSheet(true);
    } else {
      setOpenSheet(false);
    }
    return () => setOpenSheet(false);
  }, [isOnAir]);

  // Mini 사이드바 상태 + 사이드바 오픈상태 에서 화면 크기가 줄어들 경우 Mini사이드바 모드 해제
  useEffect(() => {
    if (isSmallScreen && !open) {
      setMini(true);
    } else {
      setMini(false);
    }
    return () => setMini(false);
  }, [isSmallScreen, open]);

  return (
    <RootStyle>
      <DashboardNavbar
        onOpenSidebar={() => setOpen(true)}
        onOpenSheet={() => setOpenSheet(true)}
        mini={mini}
        onChangeMiniSidebar={handleChangeMiniSidebar}
      />
      <DashboardSidebar
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
        isMiniSidebar={mini}
      />
      <MainStyle>
        <Outlet />
      </MainStyle>
      <DashboardSideSheet isOpenSheet={openSheet} onCloseSheet={() => setOpenSheet(false)} />
    </RootStyle>
  );
}
