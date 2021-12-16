import { useState } from 'react';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  TableRow,
  TableBody,
  TableHead,
  TableCell,
  Container,
  Typography,
  TableContainer,
  Paper,
  Pagination
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import SimpleBarReact from 'simplebar-react';
import { toast, Zoom } from 'react-toastify';

// reux
import { useDispatch } from 'react-redux';

// hook
import usePagination from '../hook/usePagination';

// components
import Page from '../components/Page';
import Label from '../components/Label';
import SearchNotFound from '../components/SearchNotFound';
import { UserSearchToolbar } from '../components/_dashboard/user';
import LetterAvatar from '../components/common/LetterAvatar';
import { searchUser } from '../redux/actions/userSearchAction';
// ----------------------------------------------------------------------

const UserSearchPagination = styled(Pagination)(({ theme }) => ({
  margin: theme.spacing(2),
  justifyContent: 'center',
  display: 'flex'
}));

// ----------------------------------------------------------------------
export default function UserSearch() {
  const rowsPerPage = 5;
  const [page, setPage] = useState(1);
  const [filterName, setFilterName] = useState('');
  const [searchUsers, setSearchUsers] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  const count = Math.ceil(searchUsers.length / rowsPerPage);
  const pagingData = usePagination(searchUsers, rowsPerPage);
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (filterName) {
      dispatch(searchUser(filterName))
        .then((res) => {
          setSearchUsers(res?.content);
          setIsSearch(true);
          console.log(JSON.stringify(res));
        })
        .catch((e) => {
          console.log(`검색 오류 : ${JSON.stringify(e)}`);
        });
    } else {
      toast.error('이메일 또는 닉네임을 입력하세요', {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
        transition: Zoom,
        pauseOnFocusLoss: false
      });
    }
  };
  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    pagingData.jump(newPage);
  };

  const isUserNotFound = searchUsers.length === 0;

  return (
    <Page title="Search | TTAALLKK">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Search User
          </Typography>
        </Stack>

        <Card>
          <UserSearchToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
            onSearchUser={handleSearch}
          />

          <TableContainer>
            <SimpleBarReact>
              <Table>
                {searchUsers.length > 0 && (
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">닉네임</TableCell>
                      <TableCell align="center">이메일</TableCell>
                      <TableCell align="center">Role</TableCell>
                      <TableCell align="center">친구</TableCell>
                      <TableCell align="center">접속상태</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                )}

                <TableBody>
                  {pagingData.currentData().map((row) => {
                    const { uid, email, displayName, profileUrl } = row;

                    return (
                      <TableRow hover key={uid} tabIndex={-1}>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2} margin="15px">
                            <LetterAvatar
                              src={profileUrl}
                              sx={{
                                width: 26,
                                height: 26,
                                name: displayName,
                                fontSize: 12
                              }}
                            />
                            <Typography variant="subtitle2" noWrap>
                              {displayName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">{email}</TableCell>
                        <TableCell align="center">Role</TableCell>
                        <TableCell align="center">Yes</TableCell>
                        <TableCell align="center">
                          <Label variant="ghost" color="success">
                            Active
                          </Label>
                        </TableCell>
                        <TableCell align="right">
                          <Button color="warning" variant="contained" size="small">
                            추가
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        {isSearch ? (
                          <SearchNotFound searchQuery={filterName} />
                        ) : (
                          <Paper>
                            <Typography gutterBottom align="center" variant="subtitle1">
                              친구 찾기
                            </Typography>
                            <Typography variant="body2" align="center">
                              찾고 싶은 친구의 이메일 또는 닉네임을 검색하세요.
                            </Typography>
                          </Paper>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </SimpleBarReact>
          </TableContainer>

          {searchUsers.length > 0 && (
            <UserSearchPagination
              component="div"
              shape="circular"
              count={count}
              size="large"
              page={page}
              color="primary"
              onChange={handleChangePage}
            />
          )}
        </Card>
      </Container>
    </Page>
  );
}
