import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Card, Box, CircularProgress, Chip } from '@material-ui/core';
import { Icon } from '@iconify/react';
import messageCircleOutline from '@iconify/icons-eva/message-circle-outline';

// components
import Page from '../components/Page';
import BoardContentCard from '../components/_dashboard/board/BoardContentCard';
import BoardCommentCreateEditor from '../components/_dashboard/board/BoardCommentCreateEditor';
import BoardCommentList from '../components/_dashboard/board/BoardCommentList';

// api
import { request } from '../api/axios/axios';
// ----------------------------------------------------------------------

export default function Post() {
  const params = useParams();
  const url = `/api/post/${params?.postId}`; // Url에서 파싱된 게시글아이디 파라미터 값으로 조회

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [show, setShow] = useState(false); // 데이터 패칭 이후에 랜더링을 위한 상태값

  // 게시글 데이터 조회
  const fetchPost = useCallback(async () => {
    try {
      const res = await request.get(url);
      if (res) {
        setData(res.data);
        setShow(true); // api통신 이후에 랜더링 상태값 변경
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  }, [url]);

  useEffect(() => {
    setIsLoading(true);
    fetchPost();
  }, [fetchPost]);

  if (isLoading)
    return (
      <Page title="Board: 게시글 | TTAALLKK">
        <Container>
          <Typography variant="h4" sx={{ mb: 5 }}>
            게시글
          </Typography>
          <Card>
            <Box textAlign="center" sx={{ p: 3 }}>
              <CircularProgress />
            </Box>
          </Card>
        </Container>
      </Page>
    );

  if (isError)
    return (
      <Page title="Board: 게시글 | TTAALLKK">
        <Container>
          <Typography variant="h4" sx={{ mb: 5 }}>
            게시글
          </Typography>
          <Card>
            <Box textAlign="center" sx={{ p: 3 }}>
              <Typography>오류가 발생하였습니다.</Typography>
            </Box>
          </Card>
        </Container>
      </Page>
    );

  return (
    <Page title="Board: 게시글 | TTAALLKK">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          게시글
        </Typography>
      </Container>
      {show && data && (
        <Box>
          <BoardContentCard postData={data} />
          <BoardCommentCreateEditor commentId={0} isRootComment />
          <Chip
            icon={
              <Box
                component={Icon}
                icon={messageCircleOutline}
                sx={{ minWidth: 20, minHeight: 20 }}
              />
            }
            label={`${data?.commentCnt}개의 댓글`}
            sx={{ ml: 4, mt: 4 }}
          />
          <BoardCommentList />
        </Box>
      )}
    </Page>
  );
}
