import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router';
import { logout } from '../services/auth.services';
import { authActions } from '../store/auth-slice';

function Header() {
  const { userDetails } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      dispatch(authActions.dispatchLogout());
    },
  });

  const handleLogout = () => {
    mutate();
  };

  return (
    <header className=" shadow-sm shadow-green-500 relative md:h-[70px] flex  items-center  text-gray-500 h-[50px] p-3">
      <nav className=" w-full">
        <ul className="flex justify-start md:text-lg">
          <li>
            <NavLink className={({ isActive }) => `${isActive ? 'text-blue-500' : ''} ml-10`} to="/">
              Tweets
            </NavLink>
          </li>

          {userDetails && (
            <NavLink
              className={({ isActive }) => `${isActive ? 'text-blue-500' : ''} ml-10`}
              to="/my-tweets"
            >
              My Tweets
            </NavLink>
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
