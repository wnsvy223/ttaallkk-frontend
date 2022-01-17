import { useState } from 'react';
import { Outlet } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
//
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
  const [open, setOpen] = useState(false); // 좌측 사이드바 open 상태
  const [openSheet, setOpenSheet] = useState(false); // 우측 사이드바 open 상태
  const [mini, setMini] = useState(false); // 좌측 사이드바 Mini Drawer 상태

  return (
    <RootStyle>
      <DashboardNavbar
        onOpenSidebar={() => setOpen(true)}
        onOpenSheet={() => setOpenSheet(true)}
        mini={mini}
        onSetMiniSidebar={() => setMini((prev) => !prev)}
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
