import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './lib/QueryClient';
import AuthForm from './component/AuthForm';
import RootLayout from './layout/RootLayout';
import { login, signup } from './services/auth.services';
import { Provider } from 'react-redux';
import store from './store/store';
import Authenticator from './component/Authenticator';
import AuthFormLayout from './layout/AuthFormLayout';
import Home from './component/tweets/Home';
import MyTweets from './component/tweets/MyTweets';
import LikedTweets from './component/tweets/LikedTweets';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'my-tweets',
        element: (
          <Authenticator>
            <MyTweets />
          </Authenticator>
        ),
      },
      {
        path: 'liked-tweets',
        element: (
          <Authenticator>
            <LikedTweets />
          </Authenticator>
        ),
      },
    ],
  },
  {
    path: '/signup',
    element: (
      <AuthFormLayout>
        <AuthForm submitText="Sign up" func={signup} redirecTo="/login" />
      </AuthFormLayout>
    ),
  },
  {
    path: '/login',
    element: (
      <AuthFormLayout>
        <AuthForm submitText="Login" func={login} redirecTo="/" />{' '}
      </AuthFormLayout>
    ),
  },
]);

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </QueryClientProvider>
);
