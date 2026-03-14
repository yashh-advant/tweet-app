const BASE_URI = import.meta.env.VITE_BASE_BACKEND_URI;

export const toggleTweetLike = async tweetId => {
  const response = await fetch(`${BASE_URI}/likes/like/${tweetId}`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to delete tweet');
  }

  const data = await response.json();
  // console.log(data);

  return data;
};

export const getUserLikedTweets = async () => {
  const response = await fetch(`${BASE_URI}/likes`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to delete tweet');
  }

  const data = await response.json();
  console.log(data);

  return data;
};
