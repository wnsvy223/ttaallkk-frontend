import React, { useState } from 'react';
import { Card, Button, Typography, Box, TextField, Stack } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import EditRounded from '@material-ui/icons/EditRounded';
import CancelRounded from '@material-ui/icons/CancelRounded';
import CheckCircle from '@material-ui/icons/CheckCircle';
import { updateProfile } from '../../../redux/actions/userAction';
import storage from '../../../utils/storage';

const ProfileCard = styled(Card)(() => ({
  width: '100%',
  height: '100%',
  backgroundColor: '#E5E5E5'
}));

const ProfileEditBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  // Material Ui의 미디어 쿼리기능인 breakpoints를 이용하여 모바일화면의 경우 버튼 가운데정렬
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

function UserProfileCard() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.auth.user);

  const [isEdit, setIsEdit] = useState(false);
  const [email, setEmail] = useState(user?.email);
  const [displayName, setDisplayName] = useState(user?.displayName);

  // 프로필 편집 가능 상태 변경
  const handleEditAble = () => {
    setIsEdit(!isEdit);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleDisplayNameChange = (event) => {
    setDisplayName(event.target.value);
  };

  const handleProfileEditCancel = () => {
    setIsEdit(false);
    setEmail(user?.email);
    setDisplayName(user?.displayName);
  };

  const handleProfileEditSubmit = () => {
    requestProfileUpdate(user.uid);
  };

  // 프로필 업데이트 요청(전역 상태값 변경 및 로컬스토리지에 변경된 유저데이터만 업데이트)
  const requestProfileUpdate = (uid) => {
    const body = { email, displayName, uid };
    dispatch(updateProfile(body))
      .then((res) => {
        if (res) {
          storage.update('user', 'email', res.email);
          storage.update('user', 'displayName', res.displayName);
          setIsEdit(false);
          toast.success('프로필 업데이트 성공', {
            position: toast.POSITION.TOP_CENTER
          });
        }
      })
      .catch((error) => {
        console.log(error?.response);
        toast.error(error?.response?.data?.message, {
          position: toast.POSITION.TOP_CENTER
        });
      });
  };

  return (
    <ProfileCard>
      {isEdit ? (
        <Stack justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 9 }}>
          <TextField
            name="displayName"
            label="닉네임"
            focused
            inputProps={{ style: { fontSize: 15, textAlign: 'center' } }}
            value={displayName}
            onChange={handleDisplayNameChange}
          />
          <TextField
            name="email"
            label="이메일"
            focused
            inputProps={{ style: { fontSize: 15, textAlign: 'center' } }}
            value={email}
            onChange={handleEmailChange}
          />
        </Stack>
      ) : (
        <Stack justifyContent="center" alignItems="center" spacing={1} sx={{ mt: 4 }}>
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
        </Stack>
      )}

      {isEdit ? (
        <ProfileEditBox p={2}>
          <Button
            sx={{ mr: 2 }}
            startIcon={<CheckCircle sx={{ fontSize: 16 }} />}
            color="purple"
            variant="contained"
            size="normal"
            onClick={handleProfileEditSubmit}
          >
            확인
          </Button>
          <Button
            startIcon={<CancelRounded sx={{ fontSize: 16 }} />}
            color="purple"
            variant="contained"
            size="normal"
            onClick={handleProfileEditCancel}
          >
            취소
          </Button>
        </ProfileEditBox>
      ) : (
        <ProfileEditBox p={2}>
          <Button
            startIcon={<EditRounded sx={{ fontSize: 16 }} />}
            color="secondary"
            variant="contained"
            size="normal"
            onClick={handleEditAble}
          >
            프로필 편집
          </Button>
        </ProfileEditBox>
      )}
    </ProfileCard>
  );
}

export default UserProfileCard;
