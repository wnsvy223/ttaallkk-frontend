import * as React from 'react';
import Inko from 'inko';
import PropTypes from 'prop-types';
import { Avatar } from '@material-ui/core';

/**
 * [커스텀 아바타 컴포넌트]
 * 프로필 이미지 리소스가 없을 경우 사용자의 이름 기반으로 첫글자와 색상코드가 적용
 * 사용자이름이 한글일 경우를 대비해 Inko 라이브러리로 변환하여 적용
 * props 이름은 material ui 커스텀 props 혼동방지를 위해 그대로 sx로 사용
 */
BackgroundLetterAvatars.propTypes = {
  sx: PropTypes.shape({
    name: PropTypes.string.isRequired
  }),
  src: PropTypes.string
};

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(props) {
  const inko = new Inko();
  const regex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; // 한글 체크 정규식
  const displayName = props?.name;
  const isKoreanName = regex.test(displayName.charAt(0)); // 닉네임 첫글자가 한글인지 영어인지 체크
  const convertName = isKoreanName ? inko.en2ko(displayName) : displayName; // 닉네임 첫글자가 한글이면 한글로 변환값, 영어면 그대로
  const name = displayName ? convertName : 'Unknown';
  return {
    sx: {
      ...props,
      bgcolor: stringToColor(name)
    },
    children: name.charAt(0)
  };
}

export default function BackgroundLetterAvatars({ sx, src }) {
  if (src) {
    return <Avatar sx={sx} src={src} />;
  }
  return <Avatar {...stringAvatar(sx)} src={src} />;
}
