import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@material-ui/core/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack } from '@material-ui/core';
// components
import Logo from '../../components/Logo';
import Scrollbar from '../../components/Scrollbar';
import NavSection from '../../components/NavSection';
import { MHidden } from '../../components/@material-extend';
//
import sidebarConfig from './SidebarConfig';
import decodeHTMLEntities from '../../utils/decodeHtmlEntity';
// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200]
}));

const openedMixin = (theme) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(10)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(12)} + 1px)`
  }
});

const MiniDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: DRAWER_WIDTH,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme)
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme)
    })
  })
);

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func,
  isMiniSidebar: PropTypes.bool
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar, isMiniSidebar }) {
  const { pathname } = useLocation();
  const isLoggedIn = useSelector((store) => store.auth.isLoggedIn);
  const user = useSelector((store) => store.auth.user);

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        backgroundColor: 'rgb(5, 30, 52)',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Stack
        direction={isMiniSidebar ? 'column' : 'row'}
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ py: 4 }}
      >
        <Box component={RouterLink} to="/" sx={{ display: 'inline-flex' }}>
          <Logo />
        </Box>
        <Typography variant="subtitle" sx={{ color: 'white', fontSize: isMiniSidebar ? 14 : 18 }}>
          TTAALLKK
        </Typography>
      </Stack>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="/user/profile">
          <AccountStyle style={{ justifyContent: isMiniSidebar ? 'center' : 'start' }}>
            {isLoggedIn ? (
              <Avatar src={user?.profileUrl} alt="profileUrl" sx={{ fontSize: 15 }}>
                {user?.displayName.charAt(0)}
              </Avatar>
            ) : (
              <Avatar src="/static/mock-images/avatars/avatar_default.jpg" alt="profileUrl" />
            )}
            {!isMiniSidebar && (
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                  {isLoggedIn ? decodeHTMLEntities(user?.displayName) : '닉네임'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {isLoggedIn ? decodeHTMLEntities(user?.email) : '이메일'}
                </Typography>
              </Box>
            )}
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={sidebarConfig} isMiniDrawer={isMiniSidebar} />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 3, pt: 20, pb: 3 }}>
        <Stack
          alignItems="center"
          spacing={3}
          sx={{ p: 2, backgroundColor: '#ffeeee', borderRadius: 2 }}
        >
          <Button
            fullWidth
            target="_blank"
            variant="contained"
            sx={{ fontSize: isMiniSidebar ? 10 : 14 }}
          >
            Contact Us
          </Button>
        </Stack>
      </Box>
    </Scrollbar>
  );

  return (
    <RootStyle>
      <MHidden width="lgUp">
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{
            sx: { width: DRAWER_WIDTH }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>

      <MHidden width="lgDown">
        <MiniDrawer variant="permanent" open={!isMiniSidebar}>
          {renderContent}
        </MiniDrawer>
      </MHidden>
    </RootStyle>
  );
}
