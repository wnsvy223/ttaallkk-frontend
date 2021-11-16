// material
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, CircularProgress, Fade } from '@material-ui/core';

// recoil
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { commentState } from '../../../recoil/atom';

// components
import { request } from '../../../api/axios/axios';
import BoardCommentItem from './BoardCommentItem';

// ----------------------------------------------------------------------

export default function BoardCommentList() {
  const params = useParams();

  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastElement, setLastElement] = useState(null); // 마지막 요소 구분 상태값
  const [isLast, setIsLast] = useState(false); // 마지막 페이지 구분 상태값

  const newComment = useRecoilValue(commentState); // 새로 추가되는 최상위 댓글 recoil상태값
  const resetNewComment = useResetRecoilState(commentState); // 최상위 댓글 recoil 상태값 리셋

  // 스크롤 이벤트 캐치해서 페이지 상태 증가시켜 api조회
  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        setPage((pageNum) => pageNum + 1);
      }
    })
  );

  // 최상위 부모 댓글 조회
  const fetchRootComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await request.get(`/api/comment/post/${params?.postId}?page=${page}`);
      if (res) {
        setComments((prev) => [...prev, ...res.data?.content]);
        setIsLast(res.data?.last);
        setLoading(false);
      }
    } catch (error) {
      console.log(error.response);
      setLoading(false);
    }
  }, [page, params?.postId]);

  // 마지막 페이지가 아닐경우만 최상위 댓글 조회 요청
  useEffect(() => {
    if (!isLast) {
      fetchRootComments();
    }
  }, [fetchRootComments, isLast]);

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement]);

  // recoil에 새로 추가될 최상위 댓글의 상태값을 저장한 뒤 댓글 목록 컴포넌트에서
  // 해당 상태를 구독하여 댓글 작성 시 기존 댓글 상태 배열에 값을 추가하여 랜더링
  useEffect(() => {
    if (newComment && newComment.id) {
      setComments((prev) => [...prev, newComment]);
      resetNewComment();
    }
  }, [newComment, resetNewComment]);

  return (
    <Box sx={{ pl: 4, pr: 4, pt: 2, minHeight: 300 }}>
      {comments.map((comment, index) => (
        <Fade key={index} in={comments.length > 0}>
          <div ref={setLastElement}>
            <BoardCommentItem comment={comment} />
          </div>
        </Fade>
      ))}
      {loading && (
        <Box textAlign="center" sx={{ p: 1 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
