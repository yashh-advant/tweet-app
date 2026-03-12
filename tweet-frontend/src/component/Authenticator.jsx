import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import queryClient from '../lib/QueryClient';

function Authenticator({ children }) {
  const { userDetails } = useSelector(state => state.auth);
  // console.log(userDetails);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = queryClient.getQueriesData({ queryKey: ['userData'] });
    if (!userData) {
      navigate('/login');
    }
  }, [userDetails, navigate]);

  return <>{children}</>;
}

export default Authenticator;
