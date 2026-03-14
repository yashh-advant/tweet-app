const BASE_URI = import.meta.env.VITE_BASE_BACKEND_URI;

export const addTweet = async ({ title, content }) => {
  const response = await fetch(`${BASE_URI}/tweets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) {
    throw new Error('Failed to add tweet');
  }

  const data = await response.json();

  return data;
};

export const removeTweet = async tweetId => {
  const response = await fetch(`${BASE_URI}/tweets/${tweetId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to delete tweet');
  }

  const data = await response.json();

  return data;
};

export const getAllTweets = async () => {
  const response = await fetch(`${BASE_URI}/tweets`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tweet');
  }

  const data = await response.json();
  // console.log(data);

  return data;
};

export const getUserTweets = async () => {
  const response = await fetch(`${BASE_URI}/tweets/user-tweets`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to delete tweet');
  }

  const data = await response.json();
  // console.log(data);

  return data;
};
