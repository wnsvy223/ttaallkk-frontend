import { atom } from 'recoil';

// utils
import { initialMessage } from '../utils/constant';

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

export const chatOnlyModeState = atom({
  key: 'chatOnlyModeState',
  default: false
});

export const participantListState = atom({
  key: 'participantListState',
  default: []
});

export const chatActiveState = atom({
  key: 'chatActiveState',
  default: false
});

export const notificationCountState = atom({
  key: 'notificationCountState',
  default: 0
});

export const messageListState = atom({
  key: 'messageListState',
  default: [initialMessage]
});
