// material
import {
  Card,
  CardHeader,
  Box,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Stack,
  CircularProgress
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import Moment from 'react-moment';
import 'moment/locale/ko';

// component
import SimpleBarReact from 'simplebar-react';
import LetterAvatar from '../../common/LetterAvatar';

// hook
import useRequest from '../../../hook/useRequest';
// api
import { request } from '../../../api/axios/axios';

// ----------------------------------------------------------------------
const AppNewPostCard = styled(Card)(() => ({
  height: 450
}));

const TableData = styled(TableCell)(() => ({
  padding: 12
}));

const TableCellTextView = styled(Typography)(() => ({
  fontSize: 12
}));

export default function AppNewPost() {
  const navigate = useNavigate();
  const url = `/api/post/recent`;
  const fetcher = () => request.get(url).then((res) => res.data);
  const { data, isLoading, isError } = useRequest(url, fetcher);

  const handleRowClick = (event, post) => {
    event.preventDefault();
    navigate(`/dashboard/community/${post?.categoryTag}/${post?.id}`);
  };

  if (isError)
    return (
      <AppNewPostCard>
        <CardHeader title="최근 게시글" titleTypographyProps={{ variant: 'subtitle2' }} />
        <Box textAlign="center" sx={{ p: 3 }}>
          <Typography>오류가 발생하였습니다.</Typography>
        </Box>
      </AppNewPostCard>
    );

  if (isLoading)
    return (
      <AppNewPostCard>
        <CardHeader title="최근 게시글" titleTypographyProps={{ variant: 'subtitle2' }} />
        <Box textAlign="center" sx={{ p: 3 }}>
          <CircularProgress />
        </Box>
      </AppNewPostCard>
    );

  return (
    <AppNewPostCard>
      <CardHeader title="최근 게시글" titleTypographyProps={{ variant: 'subtitle2' }} />
      <Box sx={{ p: 1, pb: 1 }}>
        {data?.length > 0 ? (
          <TableContainer sx={{ minHeight: 350 }}>
            <SimpleBarReact>
              <Table>
                <TableBody>
                  {data.slice(0, 7).map((row) => (
                    <TableRow
                      hover
                      key={row.id}
                      sx={{ cursor: 'pointer' }}
                      onClick={(event) => handleRowClick(event, row)}
                    >
                      <TableData sx={{ maxWidth: 100 }}>
                        <TableCellTextView noWrap sx={{ ml: 1, color: 'info.main' }}>
                          {`#${row.id}`}
                        </TableCellTextView>
                      </TableData>
                      <TableData sx={{ maxWidth: 100 }}>
                        <TableCellTextView noWrap sx={{ ml: 1, color: 'success.dark' }}>
                          {row.categoryName}
                        </TableCellTextView>
                      </TableData>
                      <TableData align="center" sx={{ minWidth: 200, maxWidth: 300 }}>
                        <TableCellTextView noWrap>{row.title}</TableCellTextView>
                      </TableData>
                      <TableData align="center" sx={{ maxWidth: 150 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="start"
                          spacing={1}
                        >
                          <LetterAvatar
                            src={row.profileUrl}
                            sx={{ width: 23, height: 23, name: row.displayName, fontSize: 11 }}
                          />
                          <TableCellTextView noWrap>{row.displayName}</TableCellTextView>
                        </Stack>
                      </TableData>
                      <TableData align="center">
                        <TableCellTextView noWrap sx={{ fontSize: 10, color: 'GrayText' }}>
                          <Moment fromNow>{row.createdAt}</Moment>
                        </TableCellTextView>
                      </TableData>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </SimpleBarReact>
          </TableContainer>
        ) : (
          <Box textAlign="center" sx={{ p: 3 }}>
            <Typography>최신 글이 없습니다.</Typography>
          </Box>
        )}
      </Box>
    </AppNewPostCard>
  );
}
