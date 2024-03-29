import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

// Material UI
import {
  Box,
  Button,
  Typography,
  Stack,
  Grid,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import MoreVert from '@material-ui/icons/MoreVert';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import Report from '@material-ui/icons/ReportTwoTone';

// Moment
import Moment from 'react-moment';
import 'moment/locale/ko';

// toast
import { toast } from 'react-toastify';

// TOAST UI Viewer
import { Viewer } from '@toast-ui/react-editor';

// iconify
import arrowRightBottomBold from '@iconify/icons-mdi/arrow-right-bottom-bold';
import atFill from '@iconify/icons-eva/at-fill';
import { Icon } from '@iconify/react';

// recoil
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { childrenCommentState } from '../../../recoil/atom';

// components
import BoardCommentCreateEditor from './BoardCommentCreateEditor';
import BoardCommentUpdateEditor from './BoardCommentUpdateEditor';
import AlertDialog from '../../common/AlertDialog';
import LetterAvatarButton from '../../common/LetterAvatarButton';
import Label from '../../Label';

// api
import { request } from '../../../api/axios/axios';

// utils
import decodeHtmlEntity from '../../../utils/decodeHtmlEntity';
// ----------------------------------------------------------------------

function ChildrenCommentArrow() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
      <Box
        component={Icon}
        icon={arrowRightBottomBold}
        sx={{ width: 15, height: 15, color: 'text.secondary', mb: 2 }}
      />
    </Box>
  );
}

BoardCommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  isRootComment: PropTypes.bool.isRequired
};

const ITEM_HEIGHT = 48;

const options = [
  { title: '수정', icon: <Edit sx={{ fontSize: '23px', color: 'gray' }} /> },
  { title: '삭제', icon: <Delete sx={{ fontSize: '23px', color: 'gray' }} /> },
  { title: '신고', icon: <Report sx={{ fontSize: '23px', color: 'gray' }} /> }
];

const MoreMenuItem = styled(MenuItem)(() => ({
  justifyContent: 'center'
}));

const Dot = styled('span')(() => ({
  width: '3px',
  height: '3px',
  backgroundColor: '#949494',
  borderRadius: '50%',
  display: 'inline-block'
}));

const CenterBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}));

export default function BoardCommentItem({ comment, isRootComment }) {
  const params = useParams();
  const user = useSelector((store) => store?.auth?.user);

  const [page, setPage] = useState(0); // 대댓글 페이지
  const [childrens, setChildrens] = useState([]); // 대댓글 데이터 상태값
  const [childrenCount, setChildrenCount] = useState(0); // 대댓글 카운트
  const [displayChildren, setDisplayChildren] = useState(false); // 최상위 댓글의 하위 대댓글 목록 랜더링 유무 상태값
  const [isChildrenLast, setIsChildrenLast] = useState(false); // 마지막 대댓글읹지 유무 상태값
  const [displayEditor, setDisplayEditor] = useState(false); // 대댓글 생성용 에디터 랜더링 유무 상태값
  const [createCommentNum, setCreateCommentNum] = useState(0); // 대댓글 작성할 댓글의 아이디 상태값(해당 댓글 아래 에디터 랜더링)
  const [displayUpdateEditor, setDisplayUpdateEditor] = useState(false); // 대댓글 수정용 에디터 랜더링 유무 상태값
  const [updateCommentNum, setUpdateCommentNum] = useState(0); // 수정할 댓글, 대댓글 아이디 상태값

  const newChildren = useRecoilValue(childrenCommentState); // 새로 추가되는 대댓글 recoil상태값
  const resetNewChildren = useResetRecoilState(childrenCommentState); // 대댓글 recoil 상태값 리셋

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
        setUpdateCommentNum(commentId);
        setDisplayUpdateEditor(true);
        break;
      case 1:
        setOpenDialog(true);
        break;
      case 2:
        // Todo : 댓글 신고기능
        break;
      default:
    }
  };

  // 답글용 에디터 열기
  const handleDisplayEditor = (id) => {
    setDisplayEditor(true);
    setCreateCommentNum(id);
  };

  // 답글용 에디터 닫기
  const handleCancel = () => {
    setDisplayEditor(false);
  };

  // 답글 보기
  const handleDisplayChildren = (e) => {
    e.preventDefault();
    setDisplayChildren((prev) => !prev);
    if (!displayChildren) {
      setPage(0);
      setChildrens([]);
      fetchChildrenComments(0);
    }
  };

  // 답글 더 보기
  const handleLoadMore = (e) => {
    e.preventDefault();
    fetchChildrenComments(page);
  };

  // 댓글 수정용 에디터 숨기기
  const handleHideEditor = (isDisplay) => {
    setDisplayUpdateEditor(isDisplay);
  };

  // 댓글 삭제 다이얼로그 닫기 이벤트
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  // 댓글 삭제 다이얼로그 확인 이벤트
  const handleDialogSubmit = (commentId) => {
    requestCommentDelete(commentId);
  };

  // 댓글 삭제 요청
  const requestCommentDelete = async (commentId) => {
    try {
      const res = await request.delete(`/api/comment/${commentId}`);
      if (res) {
        console.log(JSON.stringify(res.data));
        toast.success('댓글 삭제 성공', {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
        toast.error(error.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
    }
  };

  // 게시글 아이디 + 부모 댓글 아이디로 연관된 자식 댓글 조회
  const fetchChildrenComments = useCallback(
    async (pageNum) => {
      try {
        const res = await request.get(
          `/api/comment/parent/${comment?.id}/post/${params?.postId}?page=${pageNum}`
        );
        if (res) {
          setChildrens((prev) => [...prev, ...res.data?.content]);
          setIsChildrenLast(res.data?.last);
          setPage((prev) => prev + 1);
        }
      } catch (error) {
        console.log(error);
      }
    },
    [comment?.id, params?.postId]
  );

  // prop로 전달받은 대댓글 카운트값 초기 설정
  useEffect(() => {
    if (comment?.childrenCnt) {
      setChildrenCount(comment?.childrenCnt);
    }
  }, [comment?.childrenCnt]);

  // 대댓글 작성 시 대댓글 작성 요청된 부모 댓글 컴포넌트의 children 값만 업데이트하여 랜더링(대댓글 recoil상태값 변경 시 실행)
  useEffect(() => {
    if (newChildren && comment?.id === newChildren?.parent && isChildrenLast) {
      setChildrens((prev) => [...prev, newChildren]); // 대댓글 데이터 추가
      resetNewChildren(); // 대댓글 recoil 상태값 리셋
    }
    setDisplayEditor(false); // 에디터 숨김
    return () => resetNewChildren();
  }, [comment?.id, isChildrenLast, newChildren, resetNewChildren]);

  // 대댓글 작성 시 대댓글 카운트 증가(대댓글 recoil상태값 변경 시 실행)
  useEffect(() => {
    if (newChildren && comment?.id === newChildren?.parent) {
      setChildrenCount((prev) => prev + 1); // 대댓글 카운트 증가
    }
  }, [comment?.id, newChildren]);

  return (
    <Box sx={{ mb: 1 }}>
      <Stack direction="row">
        {!isRootComment && <ChildrenCommentArrow />}
        <Grid container>
          <Grid item xs={10} md={10}>
            <Stack direction="row" alignItems="center" justifyContent="start" spacing={2}>
              <LetterAvatarButton
                uid={comment?.uid}
                displayName={comment?.displayName}
                profileUrl={comment?.profileUrl}
              />
              <Box sx={{ pt: 1.5, wordBreak: 'break-all' }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="start"
                  spacing={1}
                  sx={{ pt: 0.5, pb: 0.5 }}
                >
                  {comment?.displayName === comment?.postWriterDisplayName ? (
                    <Chip
                      sx={{ fontSize: 10, height: 20, backgroundColor: '#D2D2D2' }}
                      label={`${comment?.displayName}`}
                    />
                  ) : (
                    <Typography sx={{ fontSize: 10 }}>{comment?.displayName}</Typography>
                  )}
                  <Dot />
                  <Typography noWrap sx={{ fontSize: 10, color: 'GrayText' }}>
                    <Moment fromNow>{comment?.createdAt}</Moment>
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="start" spacing={1}>
                  {comment?.toCommentId && comment?.toCommentId !== comment?.parent && (
                    <CenterBox>
                      <Label variant="filled" color="info">
                        <Box
                          component={Icon}
                          icon={atFill}
                          sx={{ width: 12, height: 12, color: 'white' }}
                        />
                        {comment?.toDisplayName}
                      </Label>
                    </CenterBox>
                  )}
                  <CenterBox>
                    <Viewer initialValue={decodeHtmlEntity(comment?.content)} />
                  </CenterBox>
                </Stack>
              </Box>
            </Stack>
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
                {user?.uid === comment.uid ? (
                  options.map((option, index) => (
                    <MoreMenuItem
                      key={index}
                      selected={option === 'Pyxis'}
                      onClick={() => {
                        handleMoreVertClose(comment?.id, index);
                      }}
                    >
                      <ListItemIcon>{option.icon}</ListItemIcon>
                      <ListItemText sx={{ textAlign: 'center' }}>{option.title}</ListItemText>
                    </MoreMenuItem>
                  ))
                ) : (
                  <MoreMenuItem
                    onClick={() => {
                      handleMoreVertClose(comment?.id, 2);
                    }}
                  >
                    <ListItemIcon>{options[2]?.icon}</ListItemIcon>
                    <ListItemText sx={{ textAlign: 'center' }}>{options[2]?.title}</ListItemText>
                  </MoreMenuItem>
                )}
              </Menu>
            </Box>
          </Grid>
        </Grid>
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="start" spacing={2}>
        {displayEditor ? (
          <Button size="small" variant="contained" onClick={handleCancel}>
            닫기
          </Button>
        ) : (
          <Button
            size="small"
            onClick={() => {
              handleDisplayEditor(comment?.id);
            }}
          >
            답글 쓰기
          </Button>
        )}
        {childrenCount > 0 &&
          (displayChildren ? (
            <Button size="small" variant="contained" onClick={handleDisplayChildren}>
              답글 접기
            </Button>
          ) : (
            <Stack direction="row" alignItems="center" justifyContent="start">
              {comment?.isContainOwnerComment && (
                <Stack direction="row" alignItems="center" justifyContent="start" spacing={0.5}>
                  <LetterAvatarButton
                    sx={{ width: 20, height: 20, fontSize: 10 }}
                    uid={comment?.postWriterUid}
                    displayName={comment?.postWriterDisplayName}
                    profileUrl={comment?.postWriterProfileUrl}
                  />
                  <Dot />
                </Stack>
              )}
              <Button size="small" onClick={handleDisplayChildren}>
                {`${childrenCount}개의 답글 보기`}
              </Button>
            </Stack>
          ))}
      </Stack>
      {createCommentNum === comment?.id && displayEditor && (
        <BoardCommentCreateEditor commentId={comment?.id} isRootComment={false} comment={comment} />
      )}
      {updateCommentNum === comment?.id && displayUpdateEditor && (
        <BoardCommentUpdateEditor
          commentId={comment?.id}
          onHideEditor={handleHideEditor}
          initialValue={comment?.content}
        />
      )}
      {childrens.length > 0 &&
        displayChildren &&
        childrens.map((item) => (
          <Fade key={item?.id} in={displayChildren}>
            <Box sx={{ pl: 5 }}>
              <BoardCommentItem comment={item} isRootComment={false} />
            </Box>
          </Fade>
        ))}
      {childrens.length > 0 && displayChildren && !isChildrenLast && (
        <Box textAlign="center">
          <Button color="primary" variant="outlined" onClick={handleLoadMore}>
            답글 더 보기
          </Button>
        </Box>
      )}
      {openDialog && (
        <AlertDialog
          element={{ title: '댓글 삭제', content: '댓글을 삭제 하시겠습니까?' }}
          open={openDialog}
          onDialogClose={handleDialogClose}
          onDialogSubmit={() => handleDialogSubmit(comment?.id)}
        />
      )}
    </Box>
  );
}
