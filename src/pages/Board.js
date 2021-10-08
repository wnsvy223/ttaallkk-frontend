import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@material-ui/core/styles';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CircularProgress,
  Pagination
} from '@material-ui/core';
import { Icon } from '@iconify/react';
import edit2Outline from '@iconify/icons-eva/edit-2-outline';

// components
import Page from '../components/Page';
import { ProductSort } from '../components/_dashboard/products';
import { BoardTable, BoardPostSearch } from '../components/_dashboard/board';

// api
import useRequest from '../hook/useRequest';
import { request } from '../api/axios/axios';
// ----------------------------------------------------------------------

Board.propTypes = {
  title: PropTypes.string.isRequired,
  category: PropTypes.number.isRequired
};

const PostPagination = styled(Pagination)(({ theme }) => ({
  margin: theme.spacing(4),
  justifyContent: 'center',
  display: 'flex'
}));

export default function Board({ title, category }) {
  const [page, setPage] = useState(1);
  const [color, setColor] = useState('info');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    setPage(1); // 게시판 카테고리가 바뀔경우 페이지 상태값은 1로 초기화
    // 게시판 카테고리별 컬러 설정
    switch (category) {
      case 1:
        setColor('info');
        break;
      case 2:
        setColor('purple');
        break;
      case 3:
        setColor('warning');
        break;
      case 4:
        setColor('error');
        break;
      default:
    }
  }, [category]);

  // 키워드 상태값이 존재하면 검색 api url로 요청
  const url = keyword
    ? `/api/post/search?keyword=${keyword}&category=${category}`
    : `/api/post?page=${page - 1}&category=${category}`;
  const fetcher = () => request.get(url).then((res) => res.data);
  const { data, isLoading, isError } = useRequest(url, fetcher);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearchPost = (searchValue) => {
    setKeyword(searchValue);
  };

  return (
    <Page title={`Board: ${title} | TTAALLKK`}>
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', pb: 2 }}>
          <Button
            sx={{ flex: 'none', marginRight: 'auto' }}
            variant="contained"
            color={color}
            component={RouterLink}
            to="/dashboard/community/create"
            startIcon={<Icon icon={edit2Outline} />}
          >
            새 글 쓰기
          </Button>
          <ProductSort />
        </Box>
        <BoardPostSearch color={color} onSearchPost={handleSearchPost} />
        {isLoading && (
          <Card>
            <Box textAlign="center" sx={{ p: 3 }}>
              <CircularProgress />
            </Box>
          </Card>
        )}
        {isError && (
          <Card>
            <Box textAlign="center" sx={{ p: 3 }}>
              <Typography>오류가 발생하였습니다.</Typography>
            </Box>
          </Card>
        )}
        {data?.content && <BoardTable post={data.content} />}
        {data?.content.length > 0 && (
          <PostPagination
            component="div"
            shape="circular"
            count={data.totalPages}
            size="middle"
            page={page}
            color={color}
            onChange={handleChangePage}
          />
        )}
      </Container>
    </Page>
  );
}
