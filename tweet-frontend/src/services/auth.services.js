const BASE_URI = import.meta.env.VITE_BASE_BACKEND_URI;

export const signup = async ({ userName, password }) => {
  const response = await fetch(`${BASE_URI}/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userName, password }),
  });

  if (!response.ok) {
    throw new Error('Failed to signup');
  }

  const data = await response.json();

  return data;
};

export const login = async ({ userName, password }) => {
  const response = await fetch(`${BASE_URI}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ userName, password }),
  });

  if (!response.ok) {
    throw new Error('Failed to signup');
  }

  const data = await response.json();

  return data;
};

export const getUserDetails = async () => {
  const response = await fetch(`${BASE_URI}/users/user-details`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to get UserDetails');
  }

  const data = await response.json();

  return data;
};

export const logout = async () => {
  const response = await fetch(`${BASE_URI}/users/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to get UserDetails');
  }

  const data = await response.json();

  return data;
};
