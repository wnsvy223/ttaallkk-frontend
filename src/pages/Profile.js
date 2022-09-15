/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useCallback } from 'react';

// prop-types
import PropTypes from 'prop-types';

// material ui
import { useParams } from 'react-router-dom';
import { Stack, Container, Typography, Box, IconButton } from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { styled } from '@material-ui/core/styles';

// toastify
import { toast } from 'react-toastify';

// redux
import { useSelector } from 'react-redux';

// component
import Page from '../components/Page';
import NotificationSwitch from '../components/_dashboard/user/NotificationSwitch';
import UserTabPanel from '../components/_dashboard/user/UserTabPanel';
import UserProfileCard from '../components/_dashboard/user/UserProfileCard';

// api
import { getUserByUid } from '../api/service/userService';

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

const ProfileAvatar = styled('img')(() => ({
  height: 100,
  width: 100,
  maxHeight: { xs: 100, md: 100 },
  maxWidth: { xs: 100, md: 100 },
  borderRadius: '50%'
}));

const AvatarBox = styled('div')({
  position: 'relative',
  width: 100,
  height: 100,
  backgroundColor: 'gray',
  borderRadius: '50%',
  display: 'flex'
});

const AvatarTextBox = styled('div')({
  margin: 'auto',
  maxWidth: 100,
  maxHeight: 100,
  padding: 20
});

const AvaterText = styled(Typography)({
  fontSize: 20,
  color: 'white'
});

Avatar.propTypes = {
  src: PropTypes.string,
  displayName: PropTypes.string
};

// 커스텀 아바타 컴포넌트
function Avatar({ src, displayName }) {
  if (src) {
    return (
      <AvatarBox sx={{ boxShadow: 5 }}>
        <ProfileAvatar src={src} />
      </AvatarBox>
    );
  }
  return (
    <AvatarBox sx={{ boxShadow: 5 }}>
      {displayName ? (
        <AvatarTextBox>
          <AvaterText noWrap>{displayName.charAt(0)}</AvaterText>
        </AvatarTextBox>
      ) : (
        <ProfileAvatar src="/static/mock-images/avatars/avatar_default.jpg" />
      )}
    </AvatarBox>
  );
}

function ProfileCard() {
  const user = useSelector((store) => store.auth.user);
  const params = useParams();

  const [preview, setPreview] = useState('');
  const [file, setFile] = useState(null);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    email: '',
    displayName: '',
    profileUrl: ''
  });

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

  // url params로 받아온 사용자 uid로 정보 조회
  const fetchUserByUid = useCallback((uid) => {
    getUserByUid(uid)
      .then((res) => {
        setCurrentUser({
          uid: res?.uid,
          email: res?.email,
          displayName: res?.displayName,
          profileUrl: res?.profileUrl
        });
      })
      .catch((error) => {
        toast.error(error);
      });
  }, []);

  // 프로필 페이지 데이터 2가지
  // 1. 현재로그인 유저 프로필 : 로컬스토리지에 저장된 유저 정보로 랜더링
  // 2. 다른 유저 프로필 : url params로 uid파싱해서 데이터 조회
  useEffect(() => {
    if (params?.uid) {
      fetchUserByUid(params?.uid);
    } else {
      setCurrentUser({
        uid: user?.uid,
        email: user?.email,
        displayName: user?.displayName,
        profileUrl: user?.profileUrl
      });
    }
  }, [fetchUserByUid, params?.uid, user?.displayName, user?.email, user?.profileUrl, user?.uid]);

  return (
    <Page title="Profile | TTAALLKK">
      <ProfileContainer>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
          {user?.uid && !params?.uid && <NotificationSwitch />}
        </Stack>

        <AvatarContainer>
          <Avatar src={preview || currentUser?.profileUrl} displayName={currentUser?.displayName} />
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
          <UserProfileCard
            onEditableProfile={handleEditProfile}
            file={file}
            currentUser={currentUser}
          />
        </Box>

        <Box mt={3}>
          <UserTabPanel />
        </Box>
      </ProfileContainer>
    </Page>
  );
}

export default ProfileCard;
