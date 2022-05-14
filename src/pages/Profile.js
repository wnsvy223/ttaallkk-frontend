/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Stack, Avatar, Container, Typography, Box, IconButton } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
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

const ProfileImageInput = styled('input')({
  display: 'none'
});

const ProfileImageButton = styled(IconButton)(() => ({
  backgroundColor: '#F2F2F2',
  '&:hover': {
    backgroundColor: '#F2F2F2'
  }
}));

function ProfileCard() {
  const user = useSelector((store) => store.auth.user);
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);
  const [isEditProfile, setIsEditProfile] = useState(false);

  const onChangePreview = (event) => {
    if (event.target.files.length) {
      handlePreview(event);
      setFile(event.target.files[0]);
    }
  };

  const handlePreview = (event) => {
    const imgTarget = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imgTarget);
    fileReader.onload = (e) => {
      setPreview(e.target.result);
    };
  };

  const handleEditProfile = (isEdit) => {
    setIsEditProfile(isEdit);
    setPreview('');
  };

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
          <Avatar src={preview || user.profileUrl} sx={{ width: 100, height: 100, boxShadow: 3 }}>
            {user?.displayName.charAt(0)}
          </Avatar>
          {isEditProfile && (
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ position: 'absolute', right: -10, mt: 1, boxShadow: 5, borderRadius: 5 }}>
                <label htmlFor="icon-button-file">
                  <ProfileImageInput
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    onChange={onChangePreview}
                  />
                  <ProfileImageButton aria-label="upload picture" component="span">
                    <PhotoCamera />
                  </ProfileImageButton>
                </label>
              </Box>
            </Box>
          )}
        </AvatarContainer>

        <Box p={2} sx={{ width: 1 }}>
          <UserProfileCard onEditableProfile={handleEditProfile} file={file} />
        </Box>

        <Box mt={3}>
          <UserTabPanel />
        </Box>
      </ProfileContainer>
    </Page>
  );
}

export default ProfileCard;
