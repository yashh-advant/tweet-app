/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { Outlet } from 'react-router';
import Header from '../component/Header';
import Toasts from '../component/toast/Toasts';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { getUserDetails } from '../services/auth.services';
import { authActions } from '../store/auth-slice';
import queryClient from '../lib/QueryClient';

function RootLayout() {
  const { toastMessage } = useSelector(state => state.ui);
  const dispatch = useDispatch();
  const { isLoading } = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const response = await getUserDetails();
      // console.log(response);
      dispatch(authActions.dispatchLogin(response.data));
      return response;
    },
  });

  // console.log(data);

  return (
    <div className="bg-[#131420] relative min-h-screen">
      <Header />
      {!isLoading && <Outlet />}
      {toastMessage && <Toasts message={toastMessage} />}
    </div>
  );
}

export default RootLayout;

export const userDetailsLoader = async () => {
  try {
    const { data } = await queryClient.fetchQuery({
      queryKey: ['userData'],
      queryFn: getUserDetails,
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};
