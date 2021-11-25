import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Moment from 'react-moment';
import 'moment/locale/ko';
import { numToKorean, FormatOptions } from 'num-to-korean';
import {
  Stack,
  Typography,
  Card,
  Box,
  Table,
  Avatar,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Badge
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import heartFill from '@iconify/icons-eva/heart-fill';

// component
import SimpleBarReact from 'simplebar-react';

// ----------------------------------------------------------------------
BoardTable.propTypes = {
  post: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  color: PropTypes.string
};

const TableData = styled(TableCell)(() => ({
  padding: 12
}));

export default function BoardTable({ category, post, color }) {
  const navigate = useNavigate();

  /**
   * 테이블의 게시글 클릭
   * @param {컴포넌트 이벤트} event
   * @param {게시글 아이디} postId
   * navigate로 이동하면서 카테고리 이름과 클릭한 게시글의 아이디값으로 히스토리 추가
   */
  const handleRowClick = (event, postId) => {
    event.preventDefault();
    navigate(`/dashboard/community/${category?.name}/${postId}`);
  };

  /**
   * 게시글 번호 부여
   * (backend api로부터 조회된 페이징 데이터의 값으로 게시글 순차 번호를 부여 -> 최신글의 번호가 총 게시글 갯수)
   * @param {게시글 페이징 데이터} data
   * @param {map 인덱스 번호} index
   * @returns 게시글 번호
   */
  const rownum = (data, index) =>
    data?.totalElements - data?.number * data?.pageable.pageSize - index;

  return (
    <Card>
      <Box sx={{ p: 1, pb: 1 }}>
        {post?.content.length > 0 ? (
          <TableContainer sx={{ minHeight: 350, p: 2 }}>
            <SimpleBarReact>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">번호</TableCell>
                    <TableCell align="center">제목</TableCell>
                    <TableCell align="center">작성자</TableCell>
                    <TableCell align="center">조회수</TableCell>
                    <TableCell align="center">좋아요</TableCell>
                    <TableCell align="center">등록일</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {post?.content.map((row, index) => (
                    <TableRow
                      hover
                      key={row.id}
                      sx={{ cursor: 'pointer' }}
                      onClick={(event) => handleRowClick(event, row.id)}
                    >
                      <TableData align="left" sx={{ minWidth: 60, maxWidth: 100 }}>
                        <Typography sx={{ ml: 1, fontSize: 12, color: 'info.main' }} noWrap>
                          {rownum(post, index)}
                        </Typography>
                      </TableData>
                      <TableData align="left" sx={{ minWidth: 400, maxWidth: 500 }}>
                        <Stack direction="row" alignItems="center" spacing={3}>
                          <Typography noWrap variant="body2" sx={{ ml: 2, fontSize: 13 }}>
                            {row.title}
                          </Typography>
                          <Box sx={{ pr: 2 }}>
                            <Badge badgeContent={row.commentCnt} color={color} />
                          </Box>
                        </Stack>
                      </TableData>
                      <TableData align="center" sx={{ maxWidth: 150 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="start"
                          spacing={1}
                        >
                          <Avatar
                            alt={row.displayName}
                            src={row.profileUrl}
                            sx={{ width: 23, height: 23 }}
                          />
                          <Typography noWrap sx={{ fontSize: 12 }}>
                            {row.displayName}
                          </Typography>
                        </Stack>
                      </TableData>
                      <TableData sx={{ minWidth: 80, maxWidth: 100 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          spacing={1}
                        >
                          <Box
                            component={Icon}
                            icon={eyeFill}
                            sx={{ minWidth: 20, minHeight: 20, color: 'primary.main' }}
                          />
                          <Typography noWrap sx={{ ml: 1, fontSize: 12, color: 'text.primary' }}>
                            {numToKorean(row.views, FormatOptions.MIXED)}
                          </Typography>
                        </Stack>
                      </TableData>
                      <TableData sx={{ minWidth: 80, maxWidth: 100 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          spacing={1}
                        >
                          <Box
                            component={Icon}
                            icon={heartFill}
                            sx={{ minWidth: 20, minHeight: 20, color: 'error.main' }}
                          />
                          <Typography noWrap sx={{ ml: 1, fontSize: 12, color: 'text.primary' }}>
                            {numToKorean(row.likeCnt, FormatOptions.MIXED)}
                          </Typography>
                        </Stack>
                      </TableData>
                      <TableData align="center" sx={{ minWidth: 80, maxWidth: 100 }}>
                        <Typography noWrap sx={{ fontSize: 10, color: 'GrayText' }}>
                          <Moment fromNow>{row.createdAt}</Moment>
                        </Typography>
                      </TableData>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </SimpleBarReact>
          </TableContainer>
        ) : (
          <Box textAlign="center" sx={{ p: 3 }}>
            <Typography>게시글이 없습니다.</Typography>
          </Box>
        )}
      </Box>
    </Card>
  );
}
