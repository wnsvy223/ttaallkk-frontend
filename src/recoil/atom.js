import { atom } from 'recoil';

export const commentState = atom({
  key: 'commentState',
  default: {}
});

export const childrenCommentState = atom({
  key: 'childrenCommentState',
  default: {}
});

export const commentCountState = atom({
  key: 'commentCount',
  default: 0
});

export const conferenceState = atom({
  key: 'conferenceState',
  default: false
});

export const conferenceLoadingState = atom({
  key: 'conferenceLoadingState',
  default: false
});

export const muteState = atom({
  key: 'muteState',
  default: false
});
