import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// material-ui
import { Box, Typography, Stack, IconButton } from '@material-ui/core';

// iconify
import { Icon } from '@iconify/react';
import ThumbUp from '@iconify/icons-fluent/thumb-like-16-regular';
import ThumbUpFill from '@iconify/icons-fluent/thumb-like-16-filled';
import ThumbDown from '@iconify/icons-fluent/thumb-dislike-16-regular';
import ThumbDownFill from '@iconify/icons-fluent/thumb-dislike-16-filled';

// toast
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
  }, [postData?.isAlreadyLike]);

  useEffect(() => {
    setLikeCount(postData?.likeCnt);
  }, [postData?.likeCnt]);

  useEffect(() => {
    setIsNotLike(postData?.isAlreadyDisLike);
  }, [postData?.isAlreadyDisLike]);

  useEffect(() => {
    setNotLikeCount(postData?.disLikeCnt);
  }, [postData?.disLikeCnt]);

  // 좋아요 등록 및 취소 요청
  const requsetUpdateLike = (postId) => {
    const body = {
      postId,
      uid: user?.uid
    };
    request
      .post(`/api/like`, body)
      .then((res) => {
        console.log(JSON.stringify(res.data));
        if (res.data?.status === 200) {
          toast.success(res.data?.message, {
            position: toast.POSITION.BOTTOM_CENTER
          });
        }
      })
      .catch((error) => {
        console.log(`좋아요 오류 : ${error}`);
      });
  };

  // 싫어요 등록 및 취소 요청
  const requsetUpdateDisLike = (postId) => {
    const body = {
      postId,
      uid: user?.uid
    };
    request
      .post(`/api/like`, body)
      .then((res) => {
        console.log(JSON.stringify(res.data));
        if (res.data?.status === 200) {
          toast.success(res.data?.message, {
            position: toast.POSITION.BOTTOM_CENTER
          });
        }
      })
      .catch((error) => {
        console.log(`싫어요 오류 : ${error}`);
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
      requsetUpdateLike(params?.postId);
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
      requsetUpdateDisLike(params?.postId);
    } else {
      toast.error('로그인이 필요합니다.', {
        position: toast.POSITION.BOTTOM_CENTER
      });
    }
  };

  return (
    <Box>
      <Stack direction="row" spacing={6}>
        <Stack spacing={1}>
          <IconButton
            color="secondary"
            aria-label="add like"
            onClick={handleLike}
            sx={{ color: 'ultramarine.light', backgroundColor: 'info.lighter' }}
          >
            <Box
              component={Icon}
              icon={isLike ? ThumbUpFill : ThumbUp}
              sx={{ width: 20, height: 20 }}
            />
          </IconButton>
          <Typography sx={{ fontSize: 13, textAlign: 'center' }}>{likeCount}</Typography>
        </Stack>
        <Stack spacing={1}>
          <IconButton
            color="secondary"
            aria-label="add not like"
            onClick={handleNotLike}
            sx={{ color: 'ultramarine.light', backgroundColor: 'info.lighter' }}
          >
            <Box
              component={Icon}
              icon={isNotLike ? ThumbDownFill : ThumbDown}
              sx={{ width: 20, height: 20 }}
            />
          </IconButton>
          <Typography sx={{ fontSize: 13, textAlign: 'center' }}>{notLikeCount}</Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
