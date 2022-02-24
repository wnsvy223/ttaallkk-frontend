import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';

// material
import { alpha, styled } from '@material-ui/core/styles';
import { Box, Stack, AppBar, Toolbar, IconButton } from '@material-ui/core';

// recoil
import { useRecoilValue } from 'recoil';
import { conferenceState } from '../../recoil/atom';

// components
import { MHidden } from '../../components/@material-extend';
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import ConferencePopover from './ConferencePopover';

// ----------------------------------------------------------------------

const MINI_DRAWER_WIDTH = 96;
const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'mini'
})(({ theme, mini }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    ...(mini
      ? {
          width: `calc(100% - ${MINI_DRAWER_WIDTH + 1}px)`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
          })
        }
      : {
          width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
          })
        })
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
  onOpenSheet: PropTypes.func,
  mini: PropTypes.bool,
  onSetMiniSidebar: PropTypes.func
};

export default function DashboardNavbar({ onOpenSidebar, onOpenSheet, mini, onSetMiniSidebar }) {
  const isOnAir = useRecoilValue(conferenceState);

  return (
    <RootStyle mini={mini}>
      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>

        <MHidden width="lgDown">
          <IconButton onClick={onSetMiniSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>

        <Searchbar />
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          {isOnAir && <ConferencePopover onPopoverClick={onOpenSheet} />}
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
