import { Icon } from '@iconify/react';
import { useRef, useState } from 'react';
import peopleFill from '@iconify/icons-eva/people-fill';
import personFill from '@iconify/icons-eva/person-fill';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { alpha } from '@material-ui/core/styles';
import { Button, Box, Divider, MenuItem, Typography, Avatar, IconButton } from '@material-ui/core';
// components
import { useSelector, useDispatch } from 'react-redux';
import MenuPopover from '../../components/MenuPopover';
//
import storage from '../../utils/storage';
import decodeHTMLEntities from '../../utils/decodeHtmlEntity';
import { LOG_OUT } from '../../redux/actionType/type';
// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: '프로필',
    icon: personFill,
    linkTo: '#'
  },
  {
    label: '친구',
    icon: peopleFill,
    linkTo: '/dashboard/user'
  },
  {
    label: '설정',
    icon: settings2Fill,
    linkTo: '#'
  }
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const dispatch = useDispatch();
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const isLoggedIn = useSelector((store) => store.auth.isLoggedIn);
  const user = useSelector((store) => store.auth.user);

  const navigate = useNavigate();
  const handleSignOut = () => {
    dispatch({ type: LOG_OUT }); // LOG_OUT액션을 dispatch하여 스토어에 저장된 상태값 초기화
    storage.remove('user'); // 스토리지에서 유저 정보 제거
    navigate('/login'); // 로그인 페이지로 이동
  };

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        {isLoggedIn ? (
          <Avatar src={user?.profileUrl} alt="profileUrl" />
        ) : (
          <Avatar src="/static/mock-images/avatars/avatar_default.jpg" alt="profileUrl" />
        )}
      </IconButton>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 220 }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle1" noWrap textAlign="center">
            {isLoggedIn ? decodeHTMLEntities(user?.displayName) : '닉네임'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap textAlign="center">
            {isLoggedIn ? decodeHTMLEntities(user?.email) : '이메일'}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {isLoggedIn &&
          MENU_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              to={option.linkTo}
              component={RouterLink}
              onClick={handleClose}
              sx={{ typography: 'body2', py: 1, px: 2.5 }}
            >
              <Box
                component={Icon}
                icon={option.icon}
                sx={{
                  mr: 2,
                  width: 24,
                  height: 24
                }}
              />

              {option.label}
            </MenuItem>
          ))}

        <Box sx={{ p: 2, pt: 1.5 }}>
          <Button fullWidth color="inherit" variant="contained" onClick={handleSignOut}>
            {isLoggedIn ? '로그아웃' : '로그인'}
          </Button>
        </Box>
      </MenuPopover>
    </>
  );
}
