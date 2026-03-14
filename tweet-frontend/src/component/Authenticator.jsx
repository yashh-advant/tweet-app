import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

function Authenticator({ children }) {
  const { userDetails } = useSelector(state => state.auth);
  console.log(userDetails);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userDetails) {
      navigate('/login');
      return;
    }
  }, [userDetails, navigate]);

  return <>{children}</>;
}

export default Authenticator;
