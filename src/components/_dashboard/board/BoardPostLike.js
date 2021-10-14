import PropTypes from 'prop-types';
import { useState } from 'react';
import { Typography, Stack, IconButton } from '@material-ui/core';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbUpAlt from '@material-ui/icons/ThumbUpAlt';
import ThumbDownAltOutlined from '@material-ui/icons/ThumbDownAltOutlined';
import ThumbDownAlt from '@material-ui/icons/ThumbDownAlt';

BoardPostLike.propTypes = {
  postData: PropTypes.object.isRequired
};

export default function BoardPostLike({ postData }) {
  const [isLike, setIsLike] = useState(postData.isAlreadyLike);
  const [isNotLike, setIsNotLike] = useState(postData.isAlreadyNotLike);

  const handleLike = () => {
    if (isLike === true) {
      setIsLike(false);
    } else {
      setIsLike(true);
      setIsNotLike(false);
    }
  };

  const handleNotLike = () => {
    if (isNotLike === true) {
      setIsNotLike(false);
    } else {
      setIsNotLike(true);
      setIsLike(false);
    }
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
        <Typography sx={{ fontSize: 13, textAlign: 'center' }}>
          {postData.likeCnt ? postData.likeCnt : 0}
        </Typography>
      </Stack>
      <Stack>
        <IconButton color="secondary" aria-label="add not like" onClick={handleNotLike}>
          {isNotLike === true ? (
            <ThumbDownAlt sx={{ fontSize: 20 }} />
          ) : (
            <ThumbDownAltOutlined sx={{ fontSize: 20 }} />
          )}
        </IconButton>
        <Typography sx={{ fontSize: 13, textAlign: 'center' }}>
          {postData.notLikeCnt ? postData.notLikeCnt : 0}
        </Typography>
      </Stack>
    </Stack>
  );
}
