import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import {
  Typography,
  Box,
  Avatar,
  Grid,
  Stack,
  Button,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Divider,
  TextField
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import messageCircleFill from '@iconify/icons-eva/message-circle-fill';
import { Icon } from '@iconify/react';

import moment from 'moment';
import 'moment/locale/ko';
import { numToKorean, FormatOptions } from 'num-to-korean';

// TOAST UI Viewer
import { Viewer } from '@toast-ui/react-editor';

// toast
import { toast } from 'react-toastify';

// utils
import decodeHtmlEntity from '../../../utils/decodeHtmlEntity';

// components
import BoardPostLike from './BoardPostLike';
import BoardEditor from './BoardEditor';
import AlertDialog from '../../common/AlertDialog';

// redux
import { updatePost, deletePost } from '../../../redux/actions/postAction';
// ----------------------------------------------------------------------

const PostContentCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  borderRadius: 3
}));

const GridItemColumn = styled(Box)(() => ({
  height: '50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: 5
}));

const CardUserPorifle = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'end',
  padding: 15,
  marginRight: 20
}));

const ControlButton = styled(Button)(() => ({
  backgroundColor: '#605A89',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#2E2851',
    color: '#fff'
  },
  boxShadow: '0px 2px 2px 0px rgba(152, 150, 181, 1)'
}));

const ControlBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '15px',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

const EditorButtonBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

export default function BoardContentCard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const editorRef = useRef();

  const user = useSelector((store) => store?.auth?.user);
  const postData = useSelector((store) => store?.post?.contents);

  const [openDialog, setOpenDialog] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const [titleValue, setTitleValue] = useState('');

  // 게시글 수정 에디터 열기
  const handleUpdatePostEditor = () => {
    setOpenEditor(true);
  };

  // 게시글 수정 에디터 닫기
  const handleCancel = () => {
    setOpenEditor(false);
  };

  // 게시글 수정 요청
  const handleUpdatePost = () => {
    requestUpdatePost();
  };

  // 게시글 삭제 다이얼로그 오픈
  const handleRemovePostDialog = () => {
    setOpenDialog(true);
  };

  // 게시글 삭제 다이얼로그 닫기 이벤트
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  // 게시글 삭제 다이얼로그 확인 이벤트
  const handleDialogSubmit = () => {
    requestRemovePost();
  };

  // 게시글 타이틀 입력창 값 이벤트
  const handleChangeTitleInput = (e) => {
    setTitleValue(e.target.value);
  };

  // 게시글 수정 요청
  const requestUpdatePost = () => {
    const editorInstance = editorRef.current?.getInstance();
    const markdown = editorInstance?.getMarkdown();
    const body = {
      title: titleValue || postData.title,
      content: markdown
    };
    dispatch(updatePost(params?.postId, body))
      .then((res) => {
        if (res) {
          toast.success('게시글 수정 성공', {
            position: toast.POSITION.BOTTOM_CENTER
          });
          setOpenEditor(false);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error(error.response.data);
          toast.error(error.response.data.message, {
            position: toast.POSITION.BOTTOM_CENTER
          });
        }
      });
  };

  // 게시글 삭제 요청
  const requestRemovePost = () => {
    dispatch(deletePost(params?.postId))
      .then((res) => {
        if (res) {
          toast.success('게시글 삭제 성공', {
            position: toast.POSITION.BOTTOM_CENTER
          });
          navigate(-1);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.error(error.response.data);
          toast.error(error.response.data.message, {
            position: toast.POSITION.BOTTOM_CENTER
          });
        }
      });
  };

  return (
    <PostContentCard>
      {!openEditor && (
        <Box>
          <Grid container sx={{ p: 1 }}>
            <Grid item xs={12} md={10}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  height: 50,
                  ml: { xs: 0, md: 2 },
                  justifyContent: { xs: 'center', md: 'start' }
                }}
              >
                <Typography sx={{ fontSize: 10, color: 'text.secondary', textAlign: 'center' }}>
                  {`#${postData.id}`}
                </Typography>
                <Typography
                  noWrap
                  sx={{ fontSize: 15, color: 'text.primary', textAlign: 'center' }}
                >
                  {postData.title}
                </Typography>
              </Stack>
            </Grid>
            <Grid container item xs={12} md={2}>
              <Grid container direction="column">
                <GridItemColumn>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'grey.600'
                      }}
                    >
                      <Box
                        component={Icon}
                        icon={messageCircleFill}
                        sx={{ width: 15, height: 15, color: 'text.secondary' }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{ ml: 0.5, fontSize: '12px', color: 'text.primary' }}
                      >
                        {numToKorean(postData.commentCnt, FormatOptions.MIXED)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: 'grey.600'
                      }}
                    >
                      <VisibilityIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                      <Typography
                        variant="subtitle2"
                        sx={{ ml: 0.5, fontSize: '12px', color: 'text.primary' }}
                      >
                        {numToKorean(postData.views, FormatOptions.MIXED)}
                      </Typography>
                    </Box>
                  </Stack>
                </GridItemColumn>
                <GridItemColumn>
                  <Typography sx={{ fontSize: 10, color: 'text.secondary', textAlign: 'center' }}>
                    {moment(postData.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </Typography>
                </GridItemColumn>
              </Grid>
            </Grid>
          </Grid>
          <Divider />
          <CardUserPorifle>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="start"
              spacing={1}
              sx={{ maxWidth: '50%' }}
            >
              <Avatar
                alt={postData.displayName}
                src={postData.profileUrl}
                sx={{ width: 26, height: 26 }}
              />
              <Typography noWrap sx={{ fontSize: 12 }}>
                {postData.displayName}
              </Typography>
            </Stack>
          </CardUserPorifle>
          {postData.photoUrl && (
            <CardMedia
              component="img"
              width="100%"
              height="50%"
              image={postData.photoUrl}
              alt="image"
            />
          )}
          <CardContent sx={{ minHeight: 400 }}>
            <Viewer initialValue={decodeHtmlEntity(postData.content)} />
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <BoardPostLike postData={postData} />
          </CardActions>
          <Divider />
          {postData.uid === user?.uid ? (
            <ControlBox>
              <ControlButton variant="contained" sx={{ mr: 1 }} onClick={handleUpdatePostEditor}>
                수정
              </ControlButton>
              <ControlButton variant="contained" sx={{ ml: 1 }} onClick={handleRemovePostDialog}>
                삭제
              </ControlButton>
            </ControlBox>
          ) : (
            <ControlBox sx={{ height: 60 }} />
          )}
        </Box>
      )}
      {openEditor && (
        <Stack sx={{ p: 2 }} spacing={4}>
          <TextField
            onChange={handleChangeTitleInput}
            fullWidth
            size="small"
            type="title"
            autoComplete="title"
            label="제목"
            color="purple"
            defaultValue={titleValue || postData.title}
            InputProps={{
              style: { fontSize: '15px' }
            }}
            InputLabelProps={{
              style: { fontSize: '13px' }
            }}
          />
          <BoardEditor
            editorRef={editorRef}
            initialValue={decodeHtmlEntity(postData.content)}
            height="600px"
          />
          <EditorButtonBox>
            <ControlButton onClick={handleUpdatePost} variant="contained" sx={{ mr: 1 }}>
              수정
            </ControlButton>
            <ControlButton onClick={handleCancel} variant="contained" sx={{ ml: 1 }}>
              취소
            </ControlButton>
          </EditorButtonBox>
        </Stack>
      )}
      {openDialog && (
        <AlertDialog
          element={{ title: '게시글 삭제', content: '게시글을 삭제 하시겠습니까?' }}
          open={openDialog}
          onDialogClose={handleDialogClose}
          onDialogSubmit={handleDialogSubmit}
        />
      )}
    </PostContentCard>
  );
}
