import { useState, useEffect, useCallback } from 'react';
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
  Paper
} from '@material-ui/core';
import SimpleBarReact from 'simplebar-react';
import { toast, Zoom } from 'react-toastify';

// reux
import { useDispatch } from 'react-redux';

// components
import Page from '../components/Page';
import Label from '../components/Label';
import SearchNotFound from '../components/SearchNotFound';
import { UserSearchToolbar } from '../components/_dashboard/user';
import LetterAvatar from '../components/common/LetterAvatar';
import { searchUser } from '../redux/actions/userSearchAction';
import { addFriend } from '../redux/actions/friendAction';
// ----------------------------------------------------------------------

export default function UserSearch() {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [filterName, setFilterName] = useState('');
  const [searchUsers, setSearchUsers] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [isLast, setIsLast] = useState(false);

  const isUserNotFound = searchUsers.length === 0;

  // 더 찾기
  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  // 유저 검색 : UserSearchToolbar 컴포넌트에서 넘어온 키워드 값으로 검색어 상태 변수 변경
  const handleSearch = (keyword) => {
    if (keyword) {
      setFilterName(keyword);
      if (keyword !== filterName) {
        setPage(0);
        setSearchUsers([]);
        setIsSearch(false);
        setIsLast(false);
      }
    } else {
      toast.error('이메일 또는 닉네임을 입력하세요', {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: 3000,
        transition: Zoom,
        pauseOnFocusLoss: false
      });
    }
  };

  // 유저 검색 api 호출
  const fetchSearchUser = useCallback(() => {
    dispatch(searchUser(filterName, page))
      .then((res) => {
        setSearchUsers((prev) => [...prev, ...res?.content]);
        setIsLast(res?.last);
        setIsSearch(true);
      })
      .catch((error) => {
        console.log(`검색 오류 : ${JSON.stringify(error)}`);
      });
  }, [dispatch, filterName, page]);

  // 친구 추가 요청
  const handleAddFriend = (uid) => {
    const body = {
      toUserUid: uid
    };
    dispatch(addFriend(body))
      .then((res) => {
        console.log(JSON.stringify(res));
      })
      .catch((error) => {
        if (error.response) {
          console.error(error.response.data);
          toast.error(error.response.data.message, {
            position: toast.POSITION.TOP_CENTER
          });
        }
      });
  };

  useEffect(() => {
    if (filterName) {
      fetchSearchUser();
    }
  }, [fetchSearchUser, filterName]);

  return (
    <Page title="Search | TTAALLKK">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Search User
          </Typography>
        </Stack>

        <Card>
          <UserSearchToolbar onSearchUser={handleSearch} />

          <TableContainer>
            <SimpleBarReact>
              <Table>
                {searchUsers.length > 0 && (
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">닉네임</TableCell>
                      <TableCell align="center">이메일</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>
                )}

                <TableBody>
                  {searchUsers.map((row) => {
                    const { uid, email, displayName, profileUrl } = row;

                    return (
                      <TableRow hover key={uid} tabIndex={-1}>
                        <TableCell component="th" scope="row" padding="none">
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            sx={{ m: 2, pl: 1 }}
                          >
                            <LetterAvatar
                              src={profileUrl}
                              sx={{
                                width: 26,
                                height: 26,
                                name: displayName,
                                fontSize: 11
                              }}
                            />
                            <Typography variant="subtitle2" noWrap>
                              {displayName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="center">
                          <Label variant="outlined" color="default" sx={{ fontSize: 13 }}>
                            {email}
                          </Label>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            color="warning"
                            variant="contained"
                            size="small"
                            onClick={() => handleAddFriend(uid)}
                          >
                            추가
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                {isUserNotFound ? (
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
                ) : (
                  <TableBody>
                    <TableRow>
                      {isLast ? (
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          더 이상 검색결과가 없습니다.
                        </TableCell>
                      ) : (
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Button onClick={handleLoadMore}>더 찾기</Button>
                        </TableCell>
                      )}
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </SimpleBarReact>
          </TableContainer>
        </Card>
      </Container>
    </Page>
  );
}
