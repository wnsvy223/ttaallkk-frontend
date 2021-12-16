import React, { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { styled, useTheme } from '@material-ui/core/styles';
import {
  useMediaQuery,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box
} from '@material-ui/core';
import InboxIcon from '@material-ui/icons/InboxOutlined';
import MailIcon from '@material-ui/icons/MailOutline';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-circle-fill';

const DRAWER_WIDTH = 300;
const DRAWER_WIDTH_MOBILE = 360;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'end'
}));

DashboardSideSheet.propTypes = {
  isOpenSheet: PropTypes.bool,
  onCloseSheet: PropTypes.func
};

export default function DashboardSideSheet({ isOpenSheet, onCloseSheet }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const WIDTH = isMobile ? DRAWER_WIDTH_MOBILE : DRAWER_WIDTH;

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
      <Divider />
      <List>
        {['1', '2', '3', '4'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['1', '2', '3'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
