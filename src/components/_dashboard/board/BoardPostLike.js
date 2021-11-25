import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// material-ui
import { Box, Typography, Stack, IconButton } from '@material-ui/core';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbUpAlt from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltOutlined from '@material-ui/icons/ThumbDownAltOutlined';
import ThumbDownAlt from '@material-ui/icons/ThumbDownAlt';
import { toast } from 'react-toastify';
// api
import { request } from '../../../api/axios/axios';

BoardPostLike.propTypes = {
  postData: PropTypes.object.isRequired
};

export default function BoardPostLike({ postData }) {
  const params = useParams();
  const user = useSelector((store) => store.auth.user);

  const [isLike, setIsLike] = useState(false);
  const [isNotLike, setIsNotLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [notLikeCount, setNotLikeCount] = useState(0);

  // props로 전달된 게시글 데이터로 좋아요 상태값 변경
  useEffect(() => {
    setIsLike(postData?.isAlreadyLike);
    setLikeCount(postData?.likeCnt);
    setIsNotLike(postData?.isAlreadyDisLike);
    setNotLikeCount(postData?.disLikeCnt);
  }, [
    postData?.isAlreadyLike,
    postData?.isAlreadyDisLike,
    postData?.likeCnt,
    postData?.disLikeCnt
  ]);

  // 좋아요 or 싫어요 등록 및 취소 요청
  const requsetUpdateLikeDisLike = (postId, url) => {
    const body = {
      postId,
      uid: user?.uid
    };
    request
      .post(url, body)
      .then((res) => {
        console.log(JSON.stringify(res.data));
        if (res.data?.status === 200) {
          toast.success(res.data?.message, {
            position: toast.POSITION.BOTTOM_CENTER
          });
        }
      })
      .catch((error) => {
        console.log(`좋아요/싫어요 오류 : ${error}`);
      });
  };

  // 좋아요 상태 변경 함수
  const handleLike = () => {
    if (user) {
      setIsLike((prev) => !prev); // 좋아요 변경(기존상태의 반대 상태로 변경)
      // 싫어요가 있을 경우 싫어요 카운트 1감소 및 싫어요 해제
      if (isNotLike) {
        setIsNotLike((prev) => !prev);
        setNotLikeCount((prev) => prev - 1);
      }
      // 좋아요가 있을 경우 좋아요 카운트 1감소 없을경우 좋아요 카운트 1증가
      if (isLike) {
        setLikeCount((prev) => prev - 1);
      } else {
        setLikeCount((prev) => prev + 1);
      }
      requsetUpdateLikeDisLike(params?.postId, `/api/like`);
    } else {
      toast.error('로그인이 필요합니다.', {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }
  };

  // 싫어요 상태 변경 함수
  const handleNotLike = () => {
    if (user) {
      setIsNotLike((prev) => !prev); // 싫어오 변경(기존상태의 반대 상태로 변경)
      // 좋아요가 있을 경우 싫어요 카운트 1감소 및 싫어요 해제
      if (isLike) {
        setIsLike((prev) => !prev);
        setLikeCount((prev) => prev - 1);
      }
      // 싫어요가 있을 경우 좋아요 카운트 1감소 없을경우 좋아요 카운트 1증가
      if (isNotLike) {
        setNotLikeCount((prev) => prev - 1);
      } else {
        setNotLikeCount((prev) => prev + 1);
      }
      requsetUpdateLikeDisLike(params?.postId, `/api/dislike`);
    } else {
      toast.error('로그인이 필요합니다.', {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={6}>
        <Stack>
          <IconButton color="secondary" aria-label="add like" onClick={handleLike}>
            {isLike ? (
              <ThumbUpAlt sx={{ fontSize: 20 }} />
            ) : (
              <ThumbUpAltOutlined sx={{ fontSize: 20 }} />
            )}
          </IconButton>
          <Typography sx={{ fontSize: 13, textAlign: 'center' }}>{likeCount}</Typography>
        </Stack>
        <Stack>
          <IconButton color="secondary" aria-label="add not like" onClick={handleNotLike}>
            {isNotLike ? (
              <ThumbDownAlt sx={{ fontSize: 20 }} />
            ) : (
              <ThumbDownAltOutlined sx={{ fontSize: 20 }} />
            )}
          </IconButton>
          <Typography sx={{ fontSize: 13, textAlign: 'center' }}>{notLikeCount}</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
