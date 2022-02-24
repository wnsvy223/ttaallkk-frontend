import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Card, Box, CircularProgress, Chip } from '@material-ui/core';
import { Icon } from '@iconify/react';
import messageCircleOutline from '@iconify/icons-eva/message-circle-outline';

// recoil
import { useResetRecoilState, useRecoilState } from 'recoil';
import { commentCountState } from '../recoil/atom';

// components
import Page from '../components/Page';
import BoardContentCard from '../components/_dashboard/board/BoardContentCard';
import BoardCommentCreateEditor from '../components/_dashboard/board/BoardCommentCreateEditor';
import BoardCommentList from '../components/_dashboard/board/BoardCommentList';

// redux
import { getPost } from '../redux/actions/postAction';
// ----------------------------------------------------------------------

export default function Post() {
  const dispatch = useDispatch();
  const params = useParams();

  const data = useSelector((store) => store?.post?.contents); // 게시글 본문 데이터
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false); // 데이터 패칭 이후에 랜더링을 위한 상태값

  const [commentCount, setCommentCount] = useRecoilState(commentCountState); // 전체 댓글 갯수 전역 상태값
  const resetCommentCount = useResetRecoilState(commentCountState); // 전체 댓글 갯수 전역 상태값 리셋

  // 게시글 본문 데이터 조회 및 상태값 디스패치
  const fetchPost = useCallback(async () => {
    setIsLoading(true);
    dispatch(getPost(params?.postId))
      .then(() => {
        setShow(true);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsError(true);
        setIsLoading(false);
      });
  }, [dispatch, params?.postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    if (data?.commentCnt) {
      setCommentCount(data?.commentCnt); // api 데이터 패치로 받아온 전체 댓글 갯수 세팅
    }
    return () => resetCommentCount(); // 랜더링 사라질 시 전체 댓글 전역상태값 리셋
  }, [data?.commentCnt, resetCommentCount, setCommentCount]);

  return (
    <Page title="Board: 게시글 | TTAALLKK">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          게시글
        </Typography>
        {isLoading && (
          <Card>
            <Box textAlign="center" sx={{ p: 3 }}>
              <CircularProgress />
            </Box>
          </Card>
        )}
        {isError && !isLoading && (
          <Card>
            <Box textAlign="center" sx={{ p: 3 }}>
              <Typography>오류가 발생하였습니다.</Typography>
            </Box>
          </Card>
        )}
        {show && data && (
          <Box>
            <BoardContentCard />
            <BoardCommentCreateEditor commentId={0} isRootComment />
            <Chip
              icon={
                <Box
                  component={Icon}
                  icon={messageCircleOutline}
                  sx={{ minWidth: 20, minHeight: 20 }}
                />
              }
              label={`${commentCount}개의 댓글`}
              sx={{ ml: 2, mt: 2 }}
            />
            <BoardCommentList />
          </Box>
        )}
      </Container>
    </Page>
  );
}
