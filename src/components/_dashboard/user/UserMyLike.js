import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Stack, Link, Card, Divider, Typography, CircularProgress } from '@material-ui/core';
import { Icon } from '@iconify/react';
import heartFill from '@iconify/icons-eva/heart-fill';
// hook
import Moment from 'react-moment';
import 'moment/locale/ko';
import { numToKorean, FormatOptions } from 'num-to-korean';
import useRequest from '../../../hook/useRequest';
// api
import { request } from '../../../api/axios/axios';
// utils
import { mockImgCover } from '../../../utils/mockImages';
// component
import Scrollbar from '../../Scrollbar';

UserMyLikeItem.propTypes = {
  likes: PropTypes.object.isRequired
};

function UserMyLikeItem({ likes }) {
  const { postId, title, likeCnt, createdAt, displayName, profileUrl } = likes;

  return (
    <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={4}>
      <Box sx={{ minWidth: 50 }}>
        <Typography variant="subtitle2" noWrap fontSize="10px">
          #{postId}
        </Typography>
      </Box>

      <Box sx={{ width: '65%', minWidth: '65%' }}>
        <Link to="#" color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {title}
          </Typography>
        </Link>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '10px' }} noWrap>
          <Moment fromNow>{createdAt}</Moment>
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: 'grey.600',
          p: 1,
          minWidth: 70
        }}
      >
        <Box component={Icon} icon={heartFill} sx={{ minWidth: 20, minHeight: 20, color: 'red' }} />
        <Typography
          variant="overline"
          noWrap
          sx={{ ml: 1, fontSize: '15px', color: 'text.primary' }}
        >
          {numToKorean(likeCnt, FormatOptions.MIXED)}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          minWidth: 200,
          maxWidth: 200
        }}
      >
        <Box
          component="img"
          alt="profileUrl"
          src={profileUrl || mockImgCover(1)}
          sx={{ width: 38, height: 38, borderRadius: 1.5 }}
        />
        <Box sx={{ textAlign: 'center', ml: 1, mr: 1, minWidth: 50 }}>
          <Link to="#" color="inherit" underline="none" component={RouterLink}>
            <Typography variant="subtitle2" noWrap sx={{ fontSize: '13px' }}>
              {displayName}
            </Typography>
          </Link>
        </Box>
      </Box>
    </Stack>
  );
}

export default function UserMyLike() {
  const user = useSelector((store) => store.auth.user);
  const url = `/api/like/user/${user.uid}`;
  const fetcher = () => request.get(url).then((res) => res.data);
  const { data, isLoading, isError } = useRequest(url, fetcher);

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
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3 }}>
          {data?.length > 0 ? (
            data.map((likes) => <UserMyLikeItem key={likes.id} likes={likes} />)
          ) : (
            <Typography>좋아요를 누른 게시글이 없습니다.</Typography>
          )}
        </Stack>
      </Scrollbar>

      <Divider />
    </Card>
  );
}
