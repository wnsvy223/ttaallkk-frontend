import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Material UI
import { Box, TextField } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { styled } from '@material-ui/core/styles';

// toast
import { toast } from 'react-toastify';

// recoil
import { useSetRecoilState } from 'recoil';
import { commentState, childrenCommentState, commentCountState } from '../../../recoil/atom';

// component
import BoardEditor from './BoardEditor';

// api
import { request } from '../../../api/axios/axios';

// ----------------------------------------------------------------------
BoardCommentCreateEditor.propTypes = {
  commentId: PropTypes.number.isRequired, // 댓글 아이디
  isRootComment: PropTypes.bool.isRequired // isRootComment ? 최상위 댓글 : 대댓글
};

const CommentEditorWrapper = styled(Box)(() => ({
  padding: '25px 15px'
}));

const CommentEditorButton = styled(LoadingButton)(() => ({
  backgroundColor: '#605A89',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#2E2851',
    color: '#fff'
  },
  boxShadow: '0px 2px 2px 0px rgba(152, 150, 181, 1)'
}));

const EditorButtonBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '15px',
  // Material Ui의 미디어 쿼리기능인 breakpoints를 이용하여 모바일화면의 경우 버튼 가운데정렬
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

export default function BoardCommentCreateEditor({ commentId, isRootComment }) {
  const editorRef = useRef();
  const params = useParams();
  const user = useSelector((store) => store?.auth?.user);

  const [isLoading, setIsLoading] = useState(false);
  const [displayEditor, setDisplayEditor] = useState(false);
  const [displayEditHelper, setDisplayEditHelper] = useState(true);

  const setRootCommentsRecoil = useSetRecoilState(commentState); // 최상위 댓글 recoil 스토어 상태 변경
  const setChildrenCommentsRecoil = useSetRecoilState(childrenCommentState); // 대댓글 rocoil 스토어 상태 변경
  const setCommentCountRecoil = useSetRecoilState(commentCountState); // 전체 댓글 갯수 rocoil 스토어 상태 변경

  // 댓글 작성
  const handleCreateComment = (e) => {
    e.preventDefault();
    const editorInstance = editorRef.current?.getInstance();
    const markdown = editorInstance?.getMarkdown();
    console.log(`마크다운 : ${markdown}`);
    if (markdown) {
      const body = {
        postId: params?.postId,
        content: markdown,
        parentId: commentId === 0 ? null : commentId,
        writerUid: user?.uid
      };
      requestCreateComment(body);
    } else {
      toast.error('댓글 내용을 입력하세요', {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }
  };

  // 댓글 작성 서버 요청
  const requestCreateComment = (body) => {
    setIsLoading(true);
    request
      .post(`/api/comment`, body)
      .then((res) => {
        toast.success('댓글 작성 성공', {
          position: toast.POSITION.BOTTOM_CENTER
        });
        if (isRootComment) {
          setDisplayEditHelper(true);
          setRootCommentsRecoil(res.data);
        } else {
          setDisplayEditHelper(false);
          setChildrenCommentsRecoil(res.data);
        }
        setCommentCountRecoil((prev) => prev + 1);
        setDisplayEditor(false);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  // 에디터 뷰 상태값 false 변경
  const handleCancel = () => {
    setDisplayEditor(false);
    setDisplayEditHelper(true);
    setIsLoading(false);
  };

  // 댓글 텍스트 필드 포커싱 이벤트 발생 시 에디터 뷰 상태값 true로 변경
  const handleFocus = () => {
    setDisplayEditor(true);
    setDisplayEditHelper(false);
  };

  useEffect(() => {
    if (!isRootComment) {
      setDisplayEditor(true);
    }
  }, [isRootComment]);

  return (
    <CommentEditorWrapper>
      {displayEditHelper && isRootComment && (
        <TextField
          variant="outlined"
          fullWidth
          placeholder="댓글을 작성하세요"
          onFocus={handleFocus}
          inputProps={{ style: { textAlign: 'center' } }}
        />
      )}
      {displayEditor && (
        <Box>
          <BoardEditor editorRef={editorRef} />
          <EditorButtonBox>
            {isRootComment ? (
              <Box>
                <CommentEditorButton
                  loading={isLoading}
                  onClick={handleCreateComment}
                  type="submit"
                  variant="contained"
                  color="purple"
                  sx={{ mr: 1 }}
                >
                  등록
                </CommentEditorButton>
                <CommentEditorButton
                  onClick={handleCancel}
                  variant="contained"
                  color="purple"
                  sx={{ ml: 1 }}
                >
                  취소
                </CommentEditorButton>
              </Box>
            ) : (
              <CommentEditorButton
                loading={isLoading}
                onClick={handleCreateComment}
                type="submit"
                variant="contained"
              >
                답글 등록
              </CommentEditorButton>
            )}
          </EditorButtonBox>
        </Box>
      )}
    </CommentEditorWrapper>
  );
}
