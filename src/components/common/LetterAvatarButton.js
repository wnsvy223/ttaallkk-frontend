import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Material UI
import { IconButton } from '@material-ui/core';

// component
import LetterAvatar from './LetterAvatar';

/**
 * [커스텀 아바타 버튼]
 * 아바타 컴포넌트의 버튼형태 컴포넌트. navigate를 이용하여 클릭 시 해당 사용자의 프로필 페이지로 이동
 */
const defaultWidth = 26;
const defaultHeight = 26;
const defaultFontSize = 11;

LetterAvatarButton.propTypes = {
  data: PropTypes.object.isRequired,
  sx: PropTypes.object
};

function LetterAvatarButton({ data, sx }) {
  const navigate = useNavigate();

  const handleAvatarClick = (event, uid) => {
    event.stopPropagation();
    navigate(`/user/profile/${uid}`);
  };

  return (
    <IconButton
      onClick={(event) => handleAvatarClick(event, data?.uid)}
      sx={{
        padding: 0,
        width: sx?.width + 4 || defaultWidth + 4,
        height: sx?.height + 4 || defaultHeight + 4
      }}
    >
      <LetterAvatar
        src={data?.profileUrl}
        sx={{
          ...sx,
          width: sx?.width || defaultWidth,
          height: sx?.height || defaultHeight,
          name: data?.displayName,
          fontSize: sx?.fontSize || defaultFontSize
        }}
      />
    </IconButton>
  );
}

export default LetterAvatarButton;
