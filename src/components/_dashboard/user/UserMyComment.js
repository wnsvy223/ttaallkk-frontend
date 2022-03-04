import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

// material
import { styled } from '@material-ui/core/styles';
import { Box, Stack, Link, Card, Divider, Typography, CircularProgress } from '@material-ui/core';

// hook
import Moment from 'react-moment';
import 'moment/locale/ko';
import useRequest from '../../../hook/useRequest';

// api
import { request } from '../../../api/axios/axios';

// component
import Scrollbar from '../../Scrollbar';
import LetterAvatar from '../../common/LetterAvatar';

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

UserMyCommentItem.propTypes = {
  comments: PropTypes.object.isRequired
};

function UserMyCommentItem({ comments }) {
  const { postId, content, createdAt, displayName, profileUrl, categoryTag, categoryName } =
    comments;

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
            {content}
          </Typography>
        </Link>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '10px' }} noWrap>
          <Moment fromNow>{createdAt}</Moment>
        </Typography>
      </ContentBox>

      <UserProfileBox>
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
            data.map((comments) => <UserMyCommentItem key={comments?.id} comments={comments} />)
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
