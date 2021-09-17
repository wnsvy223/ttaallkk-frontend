import React from 'react';
import { Card, Stack, Avatar, Button, Container, Typography, Box } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import Page from '../components/Page';
import NotificationSwitch from '../components/_dashboard/user/NotificationSwitch';
import TabPanel from '../components/_dashboard/user/UserTabPanel';

function ProfileCard() {
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

  const ProfileCard = styled(Card)(() => ({
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E5E5'
  }));

  const ProfileEditBox = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  }));

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
          <Avatar src={user.profileUrl} sx={{ width: 100, height: 100 }}>
            {user?.displayName.charAt(0)}
          </Avatar>
        </AvatarContainer>

        <Box p={2} sx={{ width: 1 }}>
          <ProfileCard>
            <Typography variant="subtitle1" noWrap textAlign="center" marginTop="60px">
              {user?.displayName}
            </Typography>
            <Typography
              p={3}
              variant="body2"
              sx={{ color: 'text.secondary' }}
              noWrap
              textAlign="center"
            >
              {user?.email}
            </Typography>
            <ProfileEditBox p={2}>
              <Button color="secondary" variant="contained" size="normal">
                프로필 편집
              </Button>
            </ProfileEditBox>
          </ProfileCard>
        </Box>

        <Box mt={3}>
          <TabPanel />
        </Box>
      </ProfileContainer>
    </Page>
  );
}

export default ProfileCard;
