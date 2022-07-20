import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Link as RouterLink, useParams } from 'react-router-dom';

// icon
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Icon } from '@iconify/react';
import messageCircleFill from '@iconify/icons-eva/message-circle-fill';
import heartFill from '@iconify/icons-eva/heart-fill';

// material
import { styled } from '@material-ui/core/styles';
import { Box, Stack, Link, Card, Typography, CircularProgress } from '@material-ui/core';

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
  width: '60%',
  minWidth: '60%'
});

const IconBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  color: 'grey.600',
  minWidth: 70
});

// ----------------------------------------------------------------------

UserMyPostItem.propTypes = {
  post: PropTypes.object.isRequired
};

function UserMyPostItem({ post }) {
  const {
    id,
    title,
    commentCnt,
    views,
    likeCnt,
    createdAt,
    displayName,
    profileUrl,
    categoryTag,
    categoryName
  } = post;

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={5}>
      <PostIdBox>
        <Typography variant="subtitle2" noWrap fontSize="10px">
          #{id}
        </Typography>
      </PostIdBox>

      <CategoryBox>
        <Typography variant="subtitle2" noWrap fontSize="10px">
          {categoryName}
        </Typography>
      </CategoryBox>

      <ContentBox>
        <Link
          to={`/dashboard/community/${categoryTag}/${id}`}
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

      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
        <LetterAvatar
          src={profileUrl}
          sx={{
            width: 36,
            height: 36,
            name: displayName,
            fontSize: 14
          }}
        />
        <Link to="#" color="inherit" underline="none" component={RouterLink}>
          <Typography variant="subtitle2" noWrap sx={{ fontSize: '15px' }}>
            {displayName}
          </Typography>
        </Link>
      </Stack>

      <Stack direction="row" spacing={2}>
        <IconBox>
          <Box
            component={Icon}
            icon={messageCircleFill}
            sx={{ width: 20, height: 20, color: 'primary.main' }}
          />
          <Typography variant="subtitle2" sx={{ ml: 0.5, fontSize: '15px', color: 'text.primary' }}>
            {numToKorean(commentCnt, FormatOptions.MIXED)}
          </Typography>
        </IconBox>

        <IconBox>
          <VisibilityIcon fontSize="small" sx={{ color: 'secondary.main' }} />
          <Typography variant="subtitle2" sx={{ ml: 0.5, fontSize: '15px', color: 'text.primary' }}>
            {numToKorean(views, FormatOptions.MIXED)}
          </Typography>
        </IconBox>

        <IconBox>
          <Box component={Icon} icon={heartFill} sx={{ width: 20, height: 20, color: 'red' }} />
          <Typography variant="subtitle2" sx={{ ml: 0.5, fontSize: '15px', color: 'text.primary' }}>
            {numToKorean(likeCnt, FormatOptions.MIXED)}
          </Typography>
        </IconBox>
      </Stack>
    </Stack>
  );
}

export default function UserMyPost() {
  const params = useParams();
  const user = useSelector((store) => store.auth.user);
  const [url, setUrl] = useState('');

  const fetcher = () => request.get(url).then((res) => res.data);
  const { data, isLoading, isError } = useRequest(url, fetcher);

  useEffect(() => {
    if (params?.uid) {
      setUrl(`/api/post/user/${params?.uid}`);
    } else {
      setUrl(`/api/post/user/${user?.uid}`);
    }
  }, [params?.uid, user?.uid]);

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
            data.map((post) => <UserMyPostItem key={post?.id} post={post} />)
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
