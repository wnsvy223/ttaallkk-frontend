/* eslint-disable prettier/prettier */
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
import { SortableMenu } from '../components/common';
import { BoardTable, BoardPostSearch } from '../components/_dashboard/board';

// api
import { request } from '../api/axios/axios';
// ----------------------------------------------------------------------

Board.propTypes = {
  title: PropTypes.string.isRequired,
  category: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired
};

const PostPagination = styled(Pagination)(({ theme }) => ({
  margin: theme.spacing(4),
  justifyContent: 'center',
  display: 'flex'
}));

export default function Board({ title, category, color }) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('createdAt');
  const navigate = useNavigate();
  const location = useLocation();
  const query = queryString.parse(location.search); // 쿼리스트링을 JSON형태로 파싱해서 키값으로 접근가능

  // 게시글 목록 데이터 조회 API 호출 함수
  const fetchBoardData = (url) => {
    setIsLoading(true);
    request
      .get(url)
      .then((res) => {
        if (res) {
          setIsLoading(false);
          setIsError(false);
          setData(res.data);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        setIsError(true);
      });
  };

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

  /**
   * 정렬 상태 변경 함수
   * @param {*} orderBy
   */
  const handleSortPost = (orderBy) => {
    setSort(orderBy);
    if (keyword) {
      navigate(`/dashboard/community/${category?.categoryTag}?search=${keyword}&sort=${orderBy}`);
    } else {
      navigate(`/dashboard/community/${category?.categoryTag}?sort=${orderBy}`);
    }
  };

  // 게시판 페이징 히스토리 상태 관리 함수(페이징 쿼리스트링 유무에 따라 상태 변경)
  const updatePageState = (page) => {
    if (page) {
      setPage(Number(page));
    } else {
      setPage(1);
    }
  };

  // 게시글 검색 히스토리 상태 관리 함수(검색 쿼리스트링 유무에 따라 상태 변경)
  const updateSearchState = (search) => {
    if (search) {
      setKeyword(search);
    } else {
      setKeyword('');
    }
  };

  // 게시글 정렬 히스토리 상태관리 함수(정렬 쿼리스트링 유무에 따라 상태 변경)
  const updateSortState = (sort) => {
    if (sort) {
      setSort(sort);
    } else {
      setSort('createdAt');
    }
  };

  /**
   * url 상태 변경 이벤트
   * 쿼리스트링으로 적용되어있는 state와 props 값들의 변화에 따라 호출할 api url변경
   */
  useEffect(() => {
    if (keyword) {
      fetchBoardData(`/api/post/search?keyword=${keyword}&category=${category?.id}&page=${page - 1}&sort=${sort}`);
    } else {
      fetchBoardData(`/api/post?category=${category?.id}&page=${page - 1}&sort=${sort}`);
    }
  }, [category?.id, keyword, page, sort]);

  useEffect(() => {
    updatePageState(query?.page);
  }, [query?.page]);

  useEffect(() => {
    updateSearchState(query?.search);
  }, [query?.search]);

  useEffect(() => {
    updateSortState(query?.sort);
  }, [query?.sort]);

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
          <SortableMenu onSortItem={handleSortPost} />
        </Box>
        <BoardPostSearch category={category} onSearchPost={handleSearchPost} color={color} />
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
        {data && !isLoading && !isError && (
          <BoardTable category={category} post={data} color={color} />
        )}
        {data && data?.content?.length > 0 && (
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
