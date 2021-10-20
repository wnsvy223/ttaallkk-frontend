import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import { useSelector } from 'react-redux';
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import Blog from './pages/Blog';
import User from './pages/User';
import NotFound from './pages/Page404';
import UserSearch from './pages/UserSearch';
import Profile from './pages/Profile';
import Board from './pages/Board';
import Editor from './pages/Editor';
import Post from './pages/Post';
// ----------------------------------------------------------------------

export default function Router() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/home" replace /> },
        { path: 'home', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'products', element: <Products /> },
        { path: 'blog', element: <Blog /> },
        { path: 'search', element: <UserSearch /> },
        {
          path: 'community/free',
          element: <Board title="자유게시판" category={{ id: 1, name: 'free' }} />
        },
        {
          path: 'community/talk',
          element: <Board title="대화게시판" category={{ id: 2, name: 'talk' }} />
        },
        {
          path: 'community/tip',
          element: <Board title="Tech&Tip" category={{ id: 3, name: 'tip' }} />
        },
        {
          path: 'community/ads',
          element: <Board title="홍보게시판" category={{ id: 4, name: 'ads' }} />
        },
        { path: 'community/create', element: <Editor /> },
        { path: 'community/:category/:postId', element: <Post /> }
      ]
    },
    {
      path: '/user',
      element: <DashboardLayout />,
      children: [
        {
          path: '/profile',
          element: isLoggedIn ? <Profile /> : <Navigate to="/dashboard/home" replace />
        }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard" replace /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
