import { atom } from 'recoil';

export const commentState = atom({
  key: 'commentState',
  default: {}
});

export const childrenCommentState = atom({
  key: 'childrenCommentState',
  default: {}
});
