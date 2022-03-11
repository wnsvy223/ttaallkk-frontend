/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
// material
import { styled, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, Drawer, IconButton, Box, CircularProgress } from '@material-ui/core';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-circle-fill';

// recoil
import { useRecoilValue } from 'recoil';
import { conferenceState, conferenceLoadingState } from '../../recoil/atom';

// component
import ConferenceRoom from '../../components/conference/ConferenceRoom';

const DRAWER_WIDTH = '30%'; // 데스크탑 화면에서는 30%
const DRAWER_WIDTH_TABLET = '50%'; // 태블릿 화면에서는 50%
const DRAWER_WIDTH_MOBILE = '100%'; // 모바일 화면에서는 Full Width

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'end'
}));

const ProgressWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '80%'
});

DashboardSideSheet.propTypes = {
  isOpenSheet: PropTypes.bool,
  onCloseSheet: PropTypes.func
};

export default function DashboardSideSheet({ isOpenSheet, onCloseSheet }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const WIDTH = isMobile ? DRAWER_WIDTH_MOBILE : isTablet ? DRAWER_WIDTH_TABLET : DRAWER_WIDTH; // 미디어 쿼리를 이용해 사이드시트의 Width 변경
  const isOnAir = useRecoilValue(conferenceState); // 음성대화 진행유무 전역 상태값
  const isLoadingConference = useRecoilValue(conferenceLoadingState);

  return (
    <Drawer
      sx={{
        width: isOpenSheet ? WIDTH : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: WIDTH
        }
      }}
      variant="persistent"
      anchor="right"
      open={isOpenSheet}
      onClose={onCloseSheet}
      PaperProps={{
        sx: { width: WIDTH }
      }}
    >
      <DrawerHeader>
        <IconButton onClick={onCloseSheet}>
          <Box
            component={Icon}
            icon={closeFill}
            sx={{ minWidth: 25, minHeight: 25, color: 'gray' }}
          />
        </IconButton>
      </DrawerHeader>
      {!isOnAir && isLoadingConference && (
        <ProgressWrapper>
          <CircularProgress color="info" />
        </ProgressWrapper>
      )}
      {isOnAir && !isLoadingConference && <ConferenceRoom />}
    </Drawer>
  );
}
