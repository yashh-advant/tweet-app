import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './lib/QueryClient';
import AuthForm from './component/AuthForm';
import RootLayout, { userDetailsLoader } from './layout/RootLayout';
import Home from './component/Home';
import { login, signup } from './services/auth.services';
import { Provider } from 'react-redux';
import store from './store/store';
import MyTweets from './component/MyTweets';
import Authenticator from './component/Authenticator';
import AuthFormLayout from './layout/AuthFormLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    loader: userDetailsLoader,
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
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  </StrictMode>
);
