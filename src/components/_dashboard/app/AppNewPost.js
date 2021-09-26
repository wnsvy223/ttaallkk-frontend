// material
import {
  Card,
  CardHeader,
  Box,
  Table,
  Avatar,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Stack,
  CircularProgress
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

import Moment from 'react-moment';
import 'moment/locale/ko';

// component
import SimpleBarReact from 'simplebar-react';

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
  const url = `/api/post/recent`;
  const fetcher = () => request.get(url).then((res) => res.data);
  const { data, isLoading, isError } = useRequest(url, fetcher);

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
                    <TableRow hover key={row.id}>
                      <TableData sx={{ maxWidth: 100 }}>
                        <TableCellTextView noWrap sx={{ ml: 1, color: 'info.main' }}>
                          {`#${row.id}`}
                        </TableCellTextView>
                      </TableData>
                      <TableData align="center" sx={{ maxWidth: 300 }}>
                        <TableCellTextView noWrap>{row.title}</TableCellTextView>
                      </TableData>
                      <TableData align="center" sx={{ maxWidth: 150 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="center"
                          spacing={1}
                        >
                          <Avatar
                            alt={row.displayName}
                            src={row.profileUrl}
                            sx={{ width: 23, height: 23 }}
                          />
                          <TableCellTextView noWrap>{row.displayName}</TableCellTextView>
                        </Stack>
                      </TableData>
                      <TableData align="center">
                        <TableCellTextView noWrap>
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
            <Typography>주간 인기글이 없습니다.</Typography>
          </Box>
        )}
      </Box>
    </AppNewPostCard>
  );
}
