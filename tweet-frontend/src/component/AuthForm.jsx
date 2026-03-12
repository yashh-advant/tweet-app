import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router';
import { authActions } from '../store/auth-slice';
import Header from './Header';

function AuthForm({ submitText, func, redirecTo }) {
  const [userDetails, setUserDetails] = useState({
    userName: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoginForm = submitText.toLowerCase() == 'login';

  const inputChangeHandler = (identifier, value) => {
    setUserDetails(prev => ({ ...prev, [identifier]: value }));
  };

  const { mutate, isPending } = useMutation({
    mutationFn: func,
    onSuccess: data => {
      // console.log(data.data);
      if (isLoginForm) {
        dispatch(authActions.dispatchLogin({ ...data.data }));
      }
      navigate(redirecTo);
    },
  });

  const hadleSubmit = event => {
    event.preventDefault();
    mutate(userDetails);
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-[#131420]">
        <form
          className="flex w-full max-w-md flex-col h-[400px] gap-8 rounded-2xl border border-gray-700 bg-gray-800 p-8 text-white shadow-lg"
          onSubmit={hadleSubmit}
        >
          <p className="text-center text-2xl font-semibold">{submitText}</p>

          <div className="flex flex-col gap-2">
            <label className="text-sm ml-1 text-gray-300" htmlFor="username">
              Username
            </label>
            <input
              className="w-full rounded-xl border border-gray-600 bg-gray-900 p-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="username"
              placeholder="username"
              value={userDetails.userName}
              onChange={e => inputChangeHandler('userName', e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm ml-1 text-gray-300" htmlFor="password">
              Password
            </label>
            <input
              className="w-full rounded-xl border border-gray-600 bg-gray-900 p-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              id="password"
              placeholder="********"
              value={userDetails.password}
              onChange={e => inputChangeHandler('password', e.target.value)}
              minLength="8"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              className="text-sm text-blue-400 hover:text-blue-300"
              to={isLoginForm ? '/signup' : '/login'}
            >
              {isLoginForm ? 'Create new account' : 'Already have an account?'}
            </Link>

            <button
              className="rounded-xl bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600 disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? (isLoginForm ? 'Logging in...' : 'Signing up...') : submitText}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AuthForm;
