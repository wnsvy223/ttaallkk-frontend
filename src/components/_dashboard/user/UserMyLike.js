import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

// material
import { styled } from '@material-ui/core/styles';
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

// component
import Scrollbar from '../../Scrollbar';
import LetterAvatar from '../../common/LetterAvatar';

// utils
import decodeHtmlEntity from '../../../utils/decodeHtmlEntity';

// ----------------------------------------------------------------------

const PostIdBox = styled(Box)({
  minWidth: 30,
  display: 'flex',
  justifyContent: 'center'
});

const CategoryBox = styled(Box)({
  minWidth: 50,
  maxWidth: 100
});

const ContentBox = styled(Box)({
  width: '65%',
  minWidth: '65%'
});

const UserProfileBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  minWidth: 150,
  maxWidth: 150
});

// ----------------------------------------------------------------------

UserMyLikeItem.propTypes = {
  likes: PropTypes.object.isRequired
};

function UserMyLikeItem({ likes }) {
  const { postId, title, likeCnt, createdAt, displayName, profileUrl, categoryTag, categoryName } =
    likes;

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={5}>
      <PostIdBox>
        <Typography variant="subtitle2" noWrap fontSize="10px">
          #{postId}
        </Typography>
      </PostIdBox>

      <CategoryBox>
        <Typography variant="subtitle2" noWrap fontSize="10px">
          {categoryName}
        </Typography>
      </CategoryBox>

      <ContentBox>
        <Link
          to={`/dashboard/community/${categoryTag}/${postId}`}
          color="inherit"
          underline="hover"
          component={RouterLink}
        >
          <Typography variant="subtitle2" noWrap>
            {decodeHtmlEntity(title)}
          </Typography>
        </Link>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '10px' }} noWrap>
          <Moment fromNow>{createdAt}</Moment>
        </Typography>
      </ContentBox>

      <UserProfileBox
        sx={{
          display: 'flex',
          alignItems: 'center',
          minWidth: 150,
          maxWidth: 150
        }}
      >
        <LetterAvatar
          src={profileUrl}
          sx={{
            width: 36,
            height: 36,
            name: displayName,
            fontSize: 14
          }}
        />
        <Box sx={{ textAlign: 'center', ml: 1, mr: 1, minWidth: 50 }}>
          <Link to="#" color="inherit" underline="none" component={RouterLink}>
            <Typography variant="subtitle2" noWrap sx={{ fontSize: '13px' }}>
              {displayName}
            </Typography>
          </Link>
        </Box>
      </UserProfileBox>

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} sx={{ pr: 5 }}>
        <Box component={Icon} icon={heartFill} sx={{ minWidth: 20, minHeight: 20, color: 'red' }} />
        <Typography variant="overline" noWrap sx={{ fontSize: '15px', color: 'text.primary' }}>
          {numToKorean(likeCnt, FormatOptions.MIXED)}
        </Typography>
      </Stack>
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
            data.map((likes) => <UserMyLikeItem key={likes?.id} likes={likes} />)
          ) : (
            <Box textAlign="center" sx={{ p: 3 }}>
              <Typography>좋아요를 누른 게시글이 없습니다.</Typography>
            </Box>
          )}
        </Stack>
      </Scrollbar>

      <Divider />
    </Card>
  );
}
