// material
import { useState, useEffect, useCallback, useRef } from 'react';
import { Box, CircularProgress, Fade } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

// redux
import { useDispatch } from 'react-redux';
import { getFriend } from '../../../redux/actions/friendAction';

// components
import FriendListItem from './FriendListItem';

// ----------------------------------------------------------------------
const FriendListWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column'
}));

export default function FriendListForIdleStatus() {
  const dispatch = useDispatch();

  const [friends, setFriends] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastElement, setLastElement] = useState(null); // 마지막 요소 구분 상태값
  const [isLast, setIsLast] = useState(false); // 마지막 페이지 구분 상태값

  // 친구 목록 조회
  const fetchFriends = useCallback(() => {
    setLoading(true);
    dispatch(getFriend(page))
      .then((res) => {
        if (res) {
          setFriends((prev) => [...prev, ...res?.content]);
          setIsLast(res?.last);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.response) {
          console.error(error.response.data);
        }
      });
  }, [dispatch, page]);

  // 스크롤 이벤트 캐치해서 페이지 상태 증가시켜 api조회
  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        setPage((pageNum) => pageNum + 1);
      }
    })
  );

  useEffect(() => {
    if (!isLast) {
      fetchFriends();
    }
    return () => setLoading(false);
  }, [fetchFriends, isLast]);

  useEffect(() => {
    const currentElement = lastElement;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement]);

  return (
    <FriendListWrapper>
      {friends
        .filter((friend) => friend?.friendStatus !== 'ACCEPT')
        .map((friend) => (
          <Fade key={friend?.friendId} in={friends.length > 0}>
            <div ref={setLastElement}>
              <FriendListItem friend={friend} />
            </div>
          </Fade>
        ))}
      {loading && (
        <Box textAlign="center" sx={{ p: 1 }}>
          <CircularProgress />
        </Box>
      )}
    </FriendListWrapper>
  );
}
