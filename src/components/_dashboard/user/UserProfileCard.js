import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

// material ui
import { Card, Button, Typography, Box, TextField, Stack } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { styled } from '@material-ui/core/styles';
import EditRounded from '@material-ui/icons/EditRounded';
import CancelRounded from '@material-ui/icons/CancelRounded';
import CheckCircle from '@material-ui/icons/CheckCircle';

// toastify
import { toast } from 'react-toastify';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, updateProfileImage } from '../../../redux/actions/userAction';

// utils
import storage from '../../../utils/storage';

const ProfileCard = styled(Card)(() => ({
  width: '100%',
  height: '100%',
  backgroundColor: '#E5E5E5'
}));

const ProfileEditBox = styled(Box)(({ theme }) => ({
  height: 80,
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  // Material Ui의 미디어 쿼리기능인 breakpoints를 이용하여 모바일화면의 경우 버튼 가운데정렬
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

UserProfileCard.propTypes = {
  onEditableProfile: PropTypes.func,
  file: PropTypes.object,
  currentUser: PropTypes.object
};

function UserProfileCard({ onEditableProfile, file, currentUser }) {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);

  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');

  // 권한 체크 : 현재 로그인한 유저의 프로필 페이지만 편집 버튼 활성화
  const isPermission = user?.uid === currentUser?.uid;

  // 프로필 편집 가능 상태 변경
  const handleEditAble = () => {
    setIsEdit(true);
    onEditableProfile(true);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleDisplayNameChange = (event) => {
    setDisplayName(event.target.value);
  };

  const handleEditDisAble = () => {
    setIsEdit(false);
    onEditableProfile(false);
  };

  // 프로필 업데이트
  const handleProfileEditSubmit = () => {
    if (user.email !== email || user.displayName !== displayName) {
      requestProfileUpdate(user.uid);
      if (file !== null) {
        requestProfileImageUpdate(user.uid, file);
      }
    } else if (file !== null) {
      requestProfileImageUpdate(user.uid, file);
    } else {
      handleEditDisAble();
    }
  };

  // 프로필 업데이트 요청(전역 상태값 변경 및 로컬스토리지에 변경된 유저데이터만 업데이트)
  const requestProfileUpdate = (uid) => {
    setIsLoading(true);
    const body = { email, displayName, uid };
    dispatch(updateProfile(body))
      .then((res) => {
        if (res) {
          storage.update('user', 'email', res.email);
          storage.update('user', 'displayName', res.displayName);
          toast.success('프로필 업데이트 성공', {
            position: toast.POSITION.TOP_CENTER
          });
          handleEditDisAble();
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error?.response);
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_CENTER
        });
        setIsLoading(false);
      });
  };

  // 프로필 이미지 업로드 및 업데이트 요청
  const requestProfileImageUpdate = async (uid, file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('files', file);
    const body = { uid, formData };
    dispatch(updateProfileImage(body))
      .then((res) => {
        if (res) {
          storage.update('user', 'profileUrl', res);
          toast.success('프로필 이미지 업데이트 성공', {
            position: toast.POSITION.TOP_CENTER
          });
          handleEditDisAble();
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error?.response);
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_CENTER
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser?.email);
      setDisplayName(currentUser?.displayName);
    } else {
      setEmail(user?.email);
      setDisplayName(user?.displayName);
    }
  }, [currentUser, user, user?.displayName, user?.email]);

  useEffect(() => {
    if (!isEdit) {
      setEmail(user?.email);
      setDisplayName(user?.displayName);
    }
  }, [user?.displayName, user?.email, isEdit]);

  return (
    <ProfileCard>
      {isEdit ? (
        <Stack justifyContent="center" alignItems="center" spacing={5} sx={{ mt: 10 }}>
          <TextField
            name="displayName"
            label="닉네임"
            focused
            color="purple"
            inputProps={{ style: { fontSize: 15, textAlign: 'center' } }}
            value={displayName}
            onChange={handleDisplayNameChange}
          />
          <TextField
            name="email"
            label="이메일"
            focused
            color="purple"
            inputProps={{ style: { fontSize: 15, textAlign: 'center' } }}
            value={email}
            onChange={handleEmailChange}
          />
        </Stack>
      ) : (
        <Stack justifyContent="center" alignItems="center" spacing={1} sx={{ mt: 4 }}>
          <Typography variant="subtitle1" noWrap textAlign="center" marginTop="60px">
            {displayName}
          </Typography>
          <Typography
            p={3}
            variant="body2"
            sx={{ color: 'text.secondary' }}
            noWrap
            textAlign="center"
          >
            {email}
          </Typography>
        </Stack>
      )}

      {isEdit ? (
        <ProfileEditBox p={2}>
          <LoadingButton
            sx={{ mr: 2 }}
            startIcon={<CheckCircle sx={{ fontSize: 16 }} />}
            color="purple"
            variant="contained"
            size="normal"
            loading={isLoading}
            onClick={handleProfileEditSubmit}
          >
            저장
          </LoadingButton>
          <Button
            startIcon={<CancelRounded sx={{ fontSize: 16 }} />}
            color="purple"
            variant="contained"
            size="normal"
            onClick={handleEditDisAble}
          >
            취소
          </Button>
        </ProfileEditBox>
      ) : (
        <ProfileEditBox p={2}>
          {isPermission && (
            <Button
              startIcon={<EditRounded sx={{ fontSize: 16 }} />}
              color="secondary"
              variant="contained"
              size="normal"
              onClick={handleEditAble}
            >
              프로필 편집
            </Button>
          )}
        </ProfileEditBox>
      )}
    </ProfileCard>
  );
}

export default UserProfileCard;
