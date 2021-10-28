import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
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
  category: PropTypes.object.isRequired
};

const PostPagination = styled(Pagination)(({ theme }) => ({
  margin: theme.spacing(4),
  justifyContent: 'center',
  display: 'flex'
}));

export default function Board({ title, category }) {
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [color, setColor] = useState('info');
  const navigate = useNavigate();
  const location = useLocation();
  const query = queryString.parse(location.search);

  useEffect(() => {
    handlePageState(query?.page);
    handleSearchState(query?.search);
    handleCategoryColor(category?.id);
  }, [category.id, query.page, query.search]);

  // 키워드 상태값이 존재하면 검색 api url로 요청
  const url = keyword
    ? `/api/post/search?keyword=${keyword}&category=${category?.id}&page=${page - 1}`
    : `/api/post?category=${category?.id}&page=${page - 1}`;
  const fetcher = () => request.get(url).then((res) => res.data);
  const { data, isLoading, isError } = useRequest(url, fetcher);

  /**
   * 페이지 상태 변경 함수
   * 키워드 상태 변수가 존재할경우(=검색기능 수행한 경우) 검색 + 페이징 api 요청 및 히스토리 적용
   * @param {*} event
   * @param {*} newPage
   */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if (keyword) {
      navigate(`/dashboard/community/${category?.categoryTag}?search=${keyword}&page=${newPage}`);
    } else {
      navigate(`/dashboard/community/${category?.categoryTag}?page=${newPage}`);
    }
  };

  /**
   * 키워드 상태 변경 함수
   * 키워드값을 파라미터로 검색 api호출
   * @param {*} searchValue
   */
  const handleSearchPost = (searchValue) => {
    setKeyword(searchValue);
    navigate(`/dashboard/community/${category?.categoryTag}?search=${searchValue}`);
  };

  // 게시판 페이징 히스토리 상태 관리 함수(페이징 쿼리스트링 유무에 따라 상태 변경)
  const handlePageState = (page) => {
    if (page) {
      setPage(Number(page));
    } else {
      setPage(1);
    }
  };

  // 게시글 검색 히스토리 상태 관리 함수(검색 쿼리스트링 유무에 따라 상태 변경)
  const handleSearchState = (search) => {
    if (search) {
      setKeyword(search);
    } else {
      setKeyword('');
    }
  };

  // 게시판 카테고리별 컬러 설정 함수
  const handleCategoryColor = (categoryId) => {
    switch (categoryId) {
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
            state={{ category: category?.id }}
            startIcon={<Icon icon={edit2Outline} />}
          >
            새 글 쓰기
          </Button>
          <ProductSort />
        </Box>
        <BoardPostSearch category={category} onSearchPost={handleSearchPost} color={color} />
        {isLoading && (
          <Card>
            <Box textAlign="center" sx={{ p: 3 }}>
              <CircularProgress />
            </Box>
          </Card>
        )}
        {!data && isError && (
          <Card>
            <Box textAlign="center" sx={{ p: 3 }}>
              <Typography>오류가 발생하였습니다.</Typography>
            </Box>
          </Card>
        )}
        {data && <BoardTable category={category} post={data} />}
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
