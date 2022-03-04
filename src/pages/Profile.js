import React from 'react';
import { Stack, Avatar, Container, Typography, Box } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import Page from '../components/Page';
import NotificationSwitch from '../components/_dashboard/user/NotificationSwitch';
import UserTabPanel from '../components/_dashboard/user/UserTabPanel';
import UserProfileCard from '../components/_dashboard/user/UserProfileCard';

const ProfileContainer = styled(Container)(() => ({
  position: 'relative'
}));

const AvatarContainer = styled(Box)(() => ({
  width: '100%',
  zIndex: 1,
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: -35,
  left: 0
}));

function ProfileCard() {
  const user = useSelector((store) => store.auth.user);

  return (
    <Page title="Profile | TTAALLKK">
      <ProfileContainer>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
          <NotificationSwitch />
        </Stack>

        <AvatarContainer>
          <Avatar src={user.profileUrl} sx={{ width: 100, height: 100, boxShadow: 3 }}>
            {user?.displayName.charAt(0)}
          </Avatar>
        </AvatarContainer>

        <Box p={2} sx={{ width: 1 }}>
          <UserProfileCard />
        </Box>

        <Box mt={3}>
          <UserTabPanel />
        </Box>
      </ProfileContainer>
    </Page>
  );
}

export default ProfileCard;
