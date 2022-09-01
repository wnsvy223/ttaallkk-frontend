import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';

// Material UI
import { Box, Button } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { styled } from '@material-ui/core/styles';

// toast
import { toast } from 'react-toastify';

// component
import BoardEditor from './BoardEditor';

// api
import { request } from '../../../api/axios/axios';

// utils
import decodeHtmlEntity from '../../../utils/decodeHtmlEntity';
// ----------------------------------------------------------------------

BoardCommentUpdateEditor.propTypes = {
  commentId: PropTypes.number.isRequired, // 댓글 아이디
  onHideEditor: PropTypes.func.isRequired, // 자식 컴포넌트인 에디터의 랜더링 제거를 위해 부모컴포넌트로 이벤트 전달
  initialValue: PropTypes.string // 댓글 수정 전 내용 초기값
};

const EditorWrapper = styled(Box)(() => ({
  padding: '25px 15px'
}));

const ButtonWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '20px 10px',
  // Material Ui의 미디어 쿼리기능인 breakpoints를 이용하여 모바일 화면의 경우 버튼 가운데정렬
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

export default function BoardCommentUpdateEditor({ commentId, onHideEditor, initialValue }) {
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef();
  const user = useSelector((store) => store.auth.user);

  // 댓글 수정용 에디터에서 markdown데이터 받아서 서버요청함수에 전달
  const handleUpdateComment = (e) => {
    e.preventDefault();
    const editorInstance = editorRef.current?.getInstance();
    const markdown = editorInstance?.getMarkdown();
    console.log(`댓글수정 마크다운 : ${markdown}`);
    if (markdown) {
      const body = {
        uid: user?.uid,
        content: markdown
      };
      requestUpdateComment(body);
    } else {
      toast.error('댓글 내용을 입력하세요', {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }
  };

  // 댓글 수정 요청
  const requestUpdateComment = async (data) => {
    console.log(`${commentId}번 댓글 수정`);
    try {
      setIsLoading(true);
      const res = await request.put(`/api/comment/${commentId}`, data);
      if (res) {
        console.log(JSON.stringify(res.data));
        toast.success('댓글 수정 성공', {
          position: toast.POSITION.BOTTOM_CENTER
        });
        onHideEditor(false);
        setIsLoading(false);
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response.data);
        toast.error(error.response.data.message, {
          position: toast.POSITION.BOTTOM_CENTER
        });
      }
      setIsLoading(false);
    }
  };

  // 부모 컴포넌트인 BoardCommentItem에 랜더링된 대댓글 수정용 에디터를 숨기기 위해 부모로 이벤트 전달
  const handleCancel = () => {
    onHideEditor(false);
    setIsLoading(false);
  };

  return (
    <EditorWrapper>
      <BoardEditor editorRef={editorRef} initialValue={decodeHtmlEntity(initialValue)} />
      <ButtonWrapper>
        <LoadingButton
          loading={isLoading}
          onClick={handleUpdateComment}
          variant="contained"
          sx={{ mr: 1 }}
        >
          댓글 수정
        </LoadingButton>
        <Button onClick={handleCancel} variant="contained" sx={{ ml: 1 }}>
          취소
        </Button>
      </ButtonWrapper>
    </EditorWrapper>
  );
}
