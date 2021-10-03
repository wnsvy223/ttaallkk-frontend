import PropTypes from 'prop-types';
import { useState } from 'react';
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
  CircularProgress,
  Pagination
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import heartFill from '@iconify/icons-eva/heart-fill';
import messageCircleFill from '@iconify/icons-eva/message-circle-fill';
// component
import SimpleBarReact from 'simplebar-react';
// api
import useRequest from '../../../hook/useRequest';
import { request } from '../../../api/axios/axios';

// ----------------------------------------------------------------------
BoardTable.propTypes = {
  category: PropTypes.number.isRequired
};

const TableData = styled(TableCell)(() => ({
  padding: 12
}));

const PostPagination = styled(Pagination)(({ theme }) => ({
  margin: theme.spacing(4),
  justifyContent: 'center',
  display: 'flex'
}));

export default function BoardTable({ category }) {
  const [page, setPage] = useState(1);

  const url = `/api/post?page=${page - 1}&category=${category}`;
  const fetcher = () => request.get(url).then((res) => res.data);
  const { data, isLoading, isError } = useRequest(url, fetcher);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  if (isError)
    return (
      <Card>
        <Box textAlign="center" sx={{ p: 3 }}>
          <Typography>오류가 발생하였습니다.</Typography>
        </Box>
      </Card>
    );

  if (isLoading)
    return (
      <Card>
        <Box textAlign="center" sx={{ p: 3 }}>
          <CircularProgress />
        </Box>
      </Card>
    );

  return (
    <Card>
      <Box sx={{ p: 1, pb: 1 }}>
        {data?.content?.length > 0 ? (
          <TableContainer sx={{ minHeight: 350, p: 2 }}>
            <SimpleBarReact>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">번호</TableCell>
                    <TableCell align="center"> 제목 </TableCell>
                    <TableCell align="center">작성자</TableCell>
                    <TableCell align="center">댓글</TableCell>
                    <TableCell align="center">조회수</TableCell>
                    <TableCell align="center">좋아요</TableCell>
                    <TableCell align="center">등록일</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.content.map((row) => (
                    <TableRow hover key={row.id} sx={{ cursor: 'pointer' }}>
                      <TableData align="left" sx={{ maxWidth: 300 }}>
                        <Typography sx={{ ml: 1, fontSize: 12, color: 'info.main' }} noWrap>
                          {`#${row.id}`}
                        </Typography>
                      </TableData>
                      <TableData align="left" sx={{ minWidth: 400 }}>
                        <Typography noWrap variant="body2" sx={{ ml: 2, fontSize: 13 }}>
                          {row.title}
                        </Typography>
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
                      <TableData sx={{ maxWidth: 100 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          spacing={1}
                        >
                          <Box
                            component={Icon}
                            icon={messageCircleFill}
                            sx={{ minWidth: 20, minHeight: 20, color: 'primary.main' }}
                          />
                          <Typography noWrap sx={{ ml: 1, fontSize: 12, color: 'text.primary' }}>
                            {numToKorean(row.commentCnt, FormatOptions.MIXED)}
                          </Typography>
                        </Stack>
                      </TableData>
                      <TableData sx={{ maxWidth: 100 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          spacing={1}
                        >
                          <Box
                            component={Icon}
                            icon={eyeFill}
                            sx={{ minWidth: 20, minHeight: 20, color: 'info.main' }}
                          />
                          <Typography noWrap sx={{ ml: 1, fontSize: 12, color: 'text.primary' }}>
                            {numToKorean(row.views, FormatOptions.MIXED)}
                          </Typography>
                        </Stack>
                      </TableData>
                      <TableData sx={{ maxWidth: 100 }}>
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
                      <TableData align="center">
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
      <PostPagination
        component="div"
        shape="circular"
        count={data.totalPages}
        size="middle"
        page={page}
        color="info"
        onChange={handleChangePage}
      />
    </Card>
  );
}
