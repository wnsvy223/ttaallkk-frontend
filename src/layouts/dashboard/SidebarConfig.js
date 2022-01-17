import { Icon } from '@iconify/react';
import homeFill from '@iconify/icons-eva/home-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import questionMarkFill from '@iconify/icons-eva/question-mark-circle-fill';
import headPoneFill from '@iconify/icons-eva/headphones-fill';
import settingFill from '@iconify/icons-ant-design/setting-filled';
import chatOutline from '@iconify/icons-ant-design/comment-outlined';
import searchOutline from '@iconify/icons-ant-design/search-outlined';
// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: '홈',
    path: '/dashboard/home',
    icon: getIcon(homeFill)
  },
  {
    title: '액티비티',
    type: 'title'
  },
  {
    title: '커뮤니티',
    icon: getIcon(fileTextFill),
    path: '/dashboard/community',
    children: [
      {
        title: '자유게시판',
        path: '/dashboard/community/free'
      },
      {
        title: '대화 게시판',
        path: '/dashboard/community/talk'
      },
      {
        title: 'Tech & Tip',
        path: '/dashboard/community/tip'
      },
      {
        title: '홍보 게시판',
        path: '/dashboard/community/ads'
      }
    ]
  },
  {
    title: '채팅',
    path: '/dashboard/chat',
    icon: getIcon(chatOutline)
  },
  {
    title: '음성대화',
    path: '/dashboard/conference',
    icon: getIcon(headPoneFill)
  },
  {
    title: '질문 / 응답',
    path: '/dashboard/question',
    icon: getIcon(questionMarkFill)
  },
  {
    title: '사용자',
    type: 'title'
  },
  {
    title: '친구 찾기',
    path: '/dashboard/search',
    icon: getIcon(searchOutline)
  },
  {
    title: '관리',
    type: 'title'
  },
  {
    title: '사이트 설정',
    path: '/user/friend',
    icon: getIcon(settingFill)
  }
];

export default sidebarConfig;
