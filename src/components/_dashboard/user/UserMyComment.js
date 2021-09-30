import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { Box, Stack, Link, Card, Divider, Typography, CircularProgress } from '@material-ui/core';
// hook
import Moment from 'react-moment';
import 'moment/locale/ko';
import useRequest from '../../../hook/useRequest';
// api
import { request } from '../../../api/axios/axios';
// utils
import { mockImgCover } from '../../../utils/mockImages';
// component
import Scrollbar from '../../Scrollbar';

UserMyCommentItem.propTypes = {
  comments: PropTypes.object.isRequired
};

function UserMyCommentItem({ comments }) {
  const { id, postId, content, createdAt, displayName, profileUrl } = comments;

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
      <Box sx={{ minWidth: 50 }}>
        <Typography variant="subtitle2" noWrap fontSize="10px">
          #{postId}
        </Typography>
      </Box>

      <Box sx={{ width: '65%', minWidth: '65%' }}>
        <Link to="#" color="inherit" underline="hover" component={RouterLink}>
          <Typography variant="subtitle2" noWrap>
            {content}
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

export default function UserMyComment() {
  const user = useSelector((store) => store.auth.user);
  const url = `/api/comment/user/${user.uid}`;
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
            data.map((comments) => <UserMyCommentItem key={comments.id} comments={comments} />)
          ) : (
            <Box textAlign="center" sx={{ p: 3 }}>
              <Typography>작성한 댓글이 없습니다.</Typography>
            </Box>
          )}
        </Stack>
      </Scrollbar>

      <Divider />
    </Card>
  );
}
