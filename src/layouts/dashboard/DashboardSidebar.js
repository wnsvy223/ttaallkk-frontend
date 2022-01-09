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
    flexShrink: 0,
    width: DRAWER_WIDTH
  }
}));

const AccountStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: theme.shape.borderRadiusSm,
  backgroundColor: theme.palette.grey[200]
}));

// ----------------------------------------------------------------------

DashboardSidebar.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function DashboardSidebar({ isOpenSidebar, onCloseSidebar }) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isLoggedIn = useSelector((store) => store.auth.isLoggedIn);
  const user = useSelector((store) => store.auth.user);

  const renderContent = (
    <Scrollbar
      sx={{
        height: '100%',
        backgroundColor: 'rgb(5, 30, 52)',
        '& .simplebar-content': { height: '100%', display: 'flex', flexDirection: 'column' }
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ py: 4 }}>
        <Box component={RouterLink} to="/" sx={{ display: 'inline-flex' }}>
          <Logo />
        </Box>
        <Typography variant="subtitle" sx={{ color: 'white' }}>
          TTAALLKK
        </Typography>
      </Stack>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none" component={RouterLink} to="/user/profile">
          <AccountStyle>
            {isLoggedIn ? (
              <Avatar src={user?.profileUrl} alt="profileUrl" sx={{ fontSize: 15 }}>
                {user?.displayName.charAt(0)}
              </Avatar>
            ) : (
              <Avatar src="/static/mock-images/avatars/avatar_default.jpg" alt="profileUrl" />
            )}
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                {isLoggedIn ? decodeHTMLEntities(user?.displayName) : '닉네임'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {isLoggedIn ? decodeHTMLEntities(user?.email) : '이메일'}
              </Typography>
            </Box>
          </AccountStyle>
        </Link>
      </Box>

      <NavSection navConfig={sidebarConfig} />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ px: 2.5, pt: 20, pb: 5 }}>
        <Stack
          alignItems="center"
          spacing={3}
          sx={{
            p: 2.5,
            pt: 5,
            borderRadius: 2,
            position: 'relative',
            bgcolor: 'grey.200'
          }}
        >
          <Button fullWidth target="_blank" variant="contained">
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
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              bgcolor: 'background.default'
            }
          }}
        >
          {renderContent}
        </Drawer>
      </MHidden>
    </RootStyle>
  );
}
