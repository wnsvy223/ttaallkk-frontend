import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Icon } from '@iconify/react';
import messageCircleFill from '@iconify/icons-eva/message-circle-fill';
import heartFill from '@iconify/icons-eva/heart-fill';
// material
import { Box, Stack, Link, Card, Typography, CircularProgress } from '@material-ui/core';
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

UserMyPostItem.propTypes = {
  post: PropTypes.object.isRequired
};

function UserMyPostItem({ post }) {
  const { id, title, commentCnt, views, likeCnt, createdAt, displayName, profileUrl } = post;

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={3}>
      <Box sx={{ minWidth: 50 }}>
        <Typography variant="subtitle2" noWrap fontSize="10px">
          #{id}
        </Typography>
      </Box>

      <Box sx={{ width: '60%', minWidth: '60%' }}>
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
        component="img"
        alt="profileUrl"
        src={profileUrl || mockImgCover(1)}
        sx={{ width: 38, height: 38, borderRadius: 1.5 }}
      />
      <Box sx={{ textAlign: 'center', minWidth: 100 }}>
        <Link to="#" color="inherit" underline="none" component={RouterLink}>
          <Typography variant="subtitle2" noWrap sx={{ fontSize: '15px' }}>
            {displayName}
          </Typography>
        </Link>
      </Box>

      <Stack direction="row" spacing={2}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'grey.600',
            minWidth: 70
          }}
        >
          <Box
            component={Icon}
            icon={messageCircleFill}
            sx={{ minWidth: 20, minHeight: 20, color: 'primary.main' }}
          />
          <Typography variant="subtitle2" sx={{ ml: 0.5, fontSize: '15px', color: 'text.primary' }}>
            {numToKorean(commentCnt, FormatOptions.MIXED)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'grey.600',
            minWidth: 70
          }}
        >
          <VisibilityIcon fontSize="small" sx={{ color: 'secondary.main' }} />
          <Typography variant="subtitle2" sx={{ ml: 0.5, fontSize: '15px', color: 'text.primary' }}>
            {numToKorean(views, FormatOptions.MIXED)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'grey.600',
            minWidth: 70,
            pr: 2
          }}
        >
          <Box
            component={Icon}
            icon={heartFill}
            sx={{ minWidth: 20, minHeight: 20, color: 'red' }}
          />
          <Typography variant="subtitle2" sx={{ ml: 0.5, fontSize: '15px', color: 'text.primary' }}>
            {numToKorean(likeCnt, FormatOptions.MIXED)}
          </Typography>
        </Box>
      </Stack>
    </Stack>
  );
}

export default function UserMyPost() {
  const user = useSelector((store) => store.auth.user);
  const url = `/api/post/user/${user.uid}`;
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
            data.map((post) => <UserMyPostItem key={post.title} post={post} />)
          ) : (
            <Box textAlign="center" sx={{ p: 3 }}>
              <Typography>작성한 게시물이 없습니다.</Typography>
            </Box>
          )}
        </Stack>
      </Scrollbar>
    </Card>
  );
}
