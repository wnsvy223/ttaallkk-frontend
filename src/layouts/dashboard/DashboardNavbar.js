import { useContext } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
import HeadphoneFill from '@iconify/icons-eva/headphones-fill';

// material
import { alpha, styled } from '@material-ui/core/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Badge } from '@material-ui/core';

// components
import { MHidden } from '../../components/@material-extend';
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';

// context
import { MessageContext } from '../../api/context/MessageContext';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${DRAWER_WIDTH + 1}px)`
  }
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5)
  }
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""'
    }
  }
}));

// ----------------------------------------------------------------------

ConferencePopover.propTypes = {
  onPopoverClick: PropTypes.func
};

function ConferencePopover({ onPopoverClick }) {
  const { speak } = useContext(MessageContext);

  return (
    <IconButton onClick={onPopoverClick}>
      {speak?.isSpeak ? (
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          variant="dot"
        >
          <Icon icon={HeadphoneFill} />
        </StyledBadge>
      ) : (
        <Icon icon={HeadphoneFill} />
      )}
    </IconButton>
  );
}

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func,
  onOpenSheet: PropTypes.func
};

export default function DashboardNavbar({ onOpenSidebar, onOpenSheet }) {
  return (
    <RootStyle>
      <ToolbarStyle>
        <MHidden width="lgUp">
          <IconButton onClick={onOpenSidebar} sx={{ mr: 1, color: 'text.primary' }}>
            <Icon icon={menu2Fill} />
          </IconButton>
        </MHidden>

        <Searchbar />
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <ConferencePopover onPopoverClick={onOpenSheet} />
          <NotificationsPopover />
          <AccountPopover />
        </Stack>
      </ToolbarStyle>
    </RootStyle>
  );
}
