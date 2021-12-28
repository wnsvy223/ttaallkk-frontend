import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

// Material UI
import {
  Box,
  Button,
  Typography,
  Stack,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import MoreVert from '@material-ui/icons/MoreVert';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import Report from '@material-ui/icons/ReportTwoTone';
// toast
import { toast } from 'react-toastify';

import { Icon } from '@iconify/react';
import checkMark from '@iconify/icons-eva/checkmark-fill';
import closeMark from '@iconify/icons-eva/close-fill';

// components
import AlertDialog from '../../common/AlertDialog';
import LetterAvatar from '../../common/LetterAvatar';
import Label from '../../Label';

// redux
import { acceptFriend, rejectFriend } from '../../../redux/actions/friendAction';

// ----------------------------------------------------------------------
const MoreMenuItem = styled(MenuItem)(() => ({
  justifyContent: 'center'
}));

const ITEM_HEIGHT = 48;

const options = [
  { title: '대화 초대', icon: <Edit sx={{ fontSize: '15px', color: 'gray' }} /> },
  { title: '친구 삭제', icon: <Delete sx={{ fontSize: '15px', color: 'gray' }} /> },
  { title: '쪽지 보내기', icon: <Report sx={{ fontSize: '15px', color: 'gray' }} /> }
];

FriendListItem.propTypes = {
  friend: PropTypes.object.isRequired
};

export default function FriendListItem({ friend }) {
  const dispatch = useDispatch();
  const user = useSelector((store) => store?.auth?.user);

  const [active, setActive] = useState(false);

  // MoreVert Icon Button
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // AlertDialog
  const [openDialog, setOpenDialog] = useState(false); // 댓글 삭제 확인 다이얼로그 상태값

  // 메뉴 확장 아이콘 클릭 이벤트
  const handleMoreVertClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // 메뉴 닫기 이벤트
  const handleMoreVertClose = (commentId, index) => {
    setAnchorEl(null);
    switch (index) {
      case 0:
        setOpenDialog(true);
        break;
      case 1:
        setOpenDialog(true);
        break;
      case 2:
        setOpenDialog(true);
        break;
      default:
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogSubmit = () => {
    setOpenDialog(false);
  };

  // 친구 추가 수락
  const handleAcceptFriend = (uid) => {
    const body = {
      fromUserUid: uid
    };
    dispatch(acceptFriend(body))
      .then((res) => {
        if (res) {
          toast.success('친구 추가 수락', {
            position: toast.POSITION.TOP_CENTER
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error(error.response.data);
          toast.error(error.response.data.message, {
            position: toast.POSITION.TOP_CENTER
          });
        }
      });
  };

  // 친구 추가 거절
  const handleRejectFriend = (uid) => {
    const body = {
      fromUserUid: uid
    };
    dispatch(rejectFriend(body))
      .then((res) => {
        if (res) {
          toast.success('친구 추가 거절', {
            position: toast.POSITION.TOP_CENTER
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error(error.response.data);
          toast.error(error.response.data.message, {
            position: toast.POSITION.TOP_CENTER
          });
        }
      });
  };

  // 친구 관계 조회값에 따라 상태 변경
  useEffect(() => {
    switch (friend?.friendStatus) {
      case 'IDLE':
        setActive(false);
        break;
      case 'ACCEPT':
        setActive(true);
        break;
      case 'REJECT':
        setActive(false);
        break;
      default:
        setActive(false);
    }
  }, [friend?.friendStatus]);

  return (
    <Box
      sx={{
        m: 2,
        p: 1,
        backgroundColor: 'background.neutral',
        borderRadius: 2,
        boxShadow: '1px 1px 3px 1px #dadce0 inset'
      }}
    >
      <Grid container alignItems="center">
        <Grid item xs={10} md={10}>
          {user?.uid === friend?.fromUser?.uid ? (
            <Grid container alignItems="center">
              <Grid item xs={2} sx={{ filter: active ? 'brightness(1)' : 'brightness(0.5)' }}>
                <LetterAvatar
                  src={friend?.profileUrl}
                  sx={{ width: 26, height: 26, name: friend?.toUser?.displayName, fontSize: 11 }}
                />
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ fontSize: 12, minWidth: 30, pr: 2 }} noWrap>
                  {friend?.toUser?.displayName}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ fontSize: 12, minWidth: 30, pr: 2 }} noWrap>
                  {friend?.toUser?.email}
                </Typography>
              </Grid>

              {(() => {
                switch (friend?.friendStatus) {
                  case 'IDLE':
                    return (
                      <Grid item xs={3} textAlign="center">
                        <Label variant="ghost" color="warning">
                          대기중
                        </Label>
                      </Grid>
                    );
                  case 'ACCEPT':
                    return (
                      <Grid item xs={3} textAlign="center">
                        <Label variant="ghost" color="success">
                          친구입니다
                        </Label>
                      </Grid>
                    );
                  case 'REJECT':
                    return (
                      <Grid item xs={3} textAlign="center" sx={{ overflow: 'auto' }}>
                        <Label variant="ghost" color="error">
                          상대방이 거절하였습니다
                        </Label>
                      </Grid>
                    );
                  default:
                    return null;
                }
              })()}
            </Grid>
          ) : (
            <Grid container alignItems="center">
              <Grid item xs={2} sx={{ filter: active ? 'brightness(1)' : 'brightness(0.5)' }}>
                <LetterAvatar
                  src={friend?.profileUrl}
                  sx={{ width: 26, height: 26, name: friend?.fromUser?.displayName, fontSize: 11 }}
                />
              </Grid>
              <Grid item xs={3}>
                <Typography sx={{ fontSize: 12, minWidth: 30, pr: 2 }} noWrap>
                  {friend?.fromUser?.displayName}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography sx={{ fontSize: 12, minWidth: 30, pr: 2 }} noWrap>
                  {friend?.fromUser?.email}
                </Typography>
              </Grid>
              {(() => {
                switch (friend?.friendStatus) {
                  case 'IDLE':
                    return (
                      <Grid item xs={3} textAlign="center">
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          spacing={2}
                        >
                          <Button
                            size="small"
                            color="purple"
                            variant="contained"
                            onClick={() => handleAcceptFriend(friend?.fromUser?.uid)}
                          >
                            <Icon icon={checkMark} fontSize="16px" />
                          </Button>
                          <Button
                            size="small"
                            color="purple"
                            variant="contained"
                            onClick={() => handleRejectFriend(friend?.fromUser?.uid)}
                          >
                            <Icon icon={closeMark} fontSize="16px" />
                          </Button>
                        </Stack>
                      </Grid>
                    );
                  case 'ACCEPT':
                    return (
                      <Grid item xs={3} textAlign="center">
                        <Label variant="ghost" color="success">
                          친구
                        </Label>
                      </Grid>
                    );
                  case 'REJECT':
                    return (
                      <Grid item xs={3} textAlign="center" sx={{ overflow: 'auto' }}>
                        <Label variant="ghost" color="error">
                          당신이 거절하였습니다
                        </Label>
                      </Grid>
                    );
                  default:
                    return null;
                }
              })()}
            </Grid>
          )}
        </Grid>
        <Grid
          item
          xs={2}
          md={2}
          sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}
        >
          <Box>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls="long-menu"
              aria-expanded={open ? 'true' : undefined}
              aria-haspopup="true"
              onClick={handleMoreVertClick}
            >
              <MoreVert />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                'aria-labelledby': 'long-button'
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleMoreVertClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '15ch'
                }
              }}
            >
              {options.map((option, index) => (
                <MoreMenuItem
                  key={index}
                  selected={option === 'Pyxis'}
                  onClick={() => {
                    handleMoreVertClose(friend?.id, index);
                  }}
                >
                  <ListItemIcon>{option.icon}</ListItemIcon>
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography type="body2" style={{ fontSize: 12, textAlign: 'center' }}>
                        {option.title}
                      </Typography>
                    }
                  />
                </MoreMenuItem>
              ))}
            </Menu>
          </Box>
        </Grid>
      </Grid>
      {openDialog && (
        <AlertDialog
          element={{ title: '제목', content: '본문' }}
          open={openDialog}
          onDialogClose={handleDialogClose}
          onDialogSubmit={() => handleDialogSubmit(friend?.id)}
        />
      )}
    </Box>
  );
}
