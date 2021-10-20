// import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// material-ui
import { Typography, Stack, IconButton } from '@material-ui/core';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbUpAlt from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltOutlined from '@material-ui/icons/ThumbDownAltOutlined';
import ThumbDownAlt from '@material-ui/icons/ThumbDownAlt';
// api
import { request } from '../../../api/axios/axios';
import useRequest from '../../../hook/useRequest';

export default function BoardPostLike() {
  const params = useParams();
  const user = useSelector((store) => store.auth.user);
  const url = `/api/post/${params?.postId}`;
  const fetcher = () => request.get(url).then((res) => res.data);
  const { data } = useRequest(url, fetcher);

  const [isLike, setIsLike] = useState(false);
  const [isNotLike, setIsNotLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [notLikeCount, setNotLikeCount] = useState(0);

  useEffect(() => {
    setIsLike(data?.isAlreadyLike);
    setLikeCount(data?.likeCnt);
  }, [data?.isAlreadyLike, data?.likeCnt]);

  const handleLike = () => {
    if (isLike === true) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    requsetUpdateLike(params?.postId);
  };

  const handleNotLike = () => {
    setIsNotLike((prev) => !prev);
    if (isNotLike === true) {
      setNotLikeCount((prev) => prev - 1);
    } else {
      setNotLikeCount((prev) => prev + 1);
    }
  };

  const requsetUpdateLike = (postId) => {
    const url = `/api/like`;
    const body = {
      postId,
      likeMemberUid: user?.uid
    };
    request.post(url, body).then((res) => {
      console.log(JSON.stringify(res.data));
      setIsLike(true);
    });
  };

  return (
    <Stack direction="row" spacing={6}>
      <Stack>
        <IconButton color="secondary" aria-label="add like" onClick={handleLike}>
          {isLike === true ? (
            <ThumbUpAlt sx={{ fontSize: 20 }} />
          ) : (
            <ThumbUpAltOutlined sx={{ fontSize: 20 }} />
          )}
        </IconButton>
        <Typography sx={{ fontSize: 13, textAlign: 'center' }}>{likeCount}</Typography>
      </Stack>
      <Stack>
        <IconButton color="secondary" aria-label="add not like" onClick={handleNotLike}>
          {isNotLike === true ? (
            <ThumbDownAlt sx={{ fontSize: 20 }} />
          ) : (
            <ThumbDownAltOutlined sx={{ fontSize: 20 }} />
          )}
        </IconButton>
        <Typography sx={{ fontSize: 13, textAlign: 'center' }}>{notLikeCount}</Typography>
      </Stack>
    </Stack>
  );
}
