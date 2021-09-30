import { Icon } from '@iconify/react';
import homeFill from '@iconify/icons-eva/home-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import questionMarkFill from '@iconify/icons-eva/question-mark-circle-fill';
import headPoneFill from '@iconify/icons-eva/headphones-fill';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: '홈',
    path: '/dashboard/home',
    icon: getIcon(homeFill)
  },
  {
    title: '친구',
    path: '/dashboard/user',
    icon: getIcon(peopleFill)
  },
  {
    title: '커뮤니티',
    icon: getIcon(fileTextFill),
    path: 'dashboard/community',
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
    title: '질문 / 응답',
    path: '/dashboard/blog',
    icon: getIcon(questionMarkFill)
  },
  {
    title: '음성대화',
    path: '/dashboard/talk',
    icon: getIcon(headPoneFill)
  }
];

export default sidebarConfig;
