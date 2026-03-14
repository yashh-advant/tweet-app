import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router';
import { logout } from '../services/auth.services';
import { authActions } from '../store/auth-slice';
import queryClient from '../lib/QueryClient';

function Header() {
  const { userDetails } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: logout,
  });

  const handleLogout = async () => {
    const response = await mutateAsync();
    console.log(response);
    if (response.success) {
      queryClient.clear();
      dispatch(authActions.dispatchLogout());
      navigate('/login');
      return;
    }
  };

  return (
    <header className=" shadow-sm shadow-green-500 relative md:h-[70px] flex  items-center  text-gray-500 h-[50px] p-3">
      <nav className=" w-full">
        <ul className="flex justify-start md:text-lg">
          <li>
            <NavLink
              className={({ isActive }) => `${isActive ? 'text-blue-500' : ''} ml-10`}
              to="/"
            >
              Tweets
            </NavLink>
          </li>

          {userDetails && (
            <>
              <NavLink
                className={({ isActive }) => `${isActive ? 'text-blue-500' : ''} ml-10`}
                to="/my-tweets"
              >
                My Tweets
              </NavLink>

              <NavLink
                className={({ isActive }) => `${isActive ? 'text-blue-500' : ''} ml-10`}
                to="/liked-tweets"
              >
                Liked Tweets
              </NavLink>
            </>
          )}

          {userDetails ? (
            <li className="self-end ml-auto flex gap-5 pr-8 mr-8">
              <button className="text-red-300" onClick={handleLogout}>
                {isPending ? 'Logging out' : 'Logout'}{' '}
              </button>
              <p className="text-white">{userDetails?.userName}</p>
            </li>
          ) : (
            <li className="self-end ml-auto flex gap-5 pr-8">
              <NavLink
                className={({ isActive }) => `${isActive ? 'text-blue-500' : ''} ml-10`}
                to="/signup"
              >
                Sign up
              </NavLink>

              <NavLink
                className={({ isActive }) => `${isActive ? 'text-blue-500' : ''} ml-10`}
                to="/login"
              >
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
