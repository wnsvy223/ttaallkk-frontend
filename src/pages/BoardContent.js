import { useParams } from 'react-router-dom';
import { Container, Typography, Card, CircularProgress } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
// components
import Page from '../components/Page';
import BoardContentCard from '../components/_dashboard/board/BoardContentCard';

// api
import useRequest from '../hook/useRequest';
import { request } from '../api/axios/axios';
// ----------------------------------------------------------------------

const ContentMessageBox = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  margin: 15
}));

export default function BoardContent() {
  const params = useParams();
  const url = `/api/post/${params?.postId}`; // Url에서 파싱된 게시글아이디 파라미터 값으로 조회
  const fetcher = () => request.get(url).then((res) => res.data);
  const { data, isLoading, isError } = useRequest(url, fetcher);

  if (isLoading) {
    return (
      <ContentMessageBox>
        <CircularProgress />
      </ContentMessageBox>
    );
  }

  if (isError) {
    return (
      <ContentMessageBox>
        <Typography>오류가 발생하였습니다.</Typography>
      </ContentMessageBox>
    );
  }

  return (
    <Page title="Board: 게시글 | TTAALLKK">
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          게시글
        </Typography>
      </Container>
      {data && <BoardContentCard postData={data} />}
    </Page>
  );
}
