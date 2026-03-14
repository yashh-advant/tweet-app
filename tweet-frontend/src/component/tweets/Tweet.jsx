import React from 'react';
import notLiked from '/public/not-liked.png';
import liked from '/public/liked.png';
import { useMutation } from '@tanstack/react-query';
import { toggleTweetLike } from '../../services/like.services';
import queryClient from '../../lib/QueryClient';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

// shadow-md shadow-green-500
function Tweet({ keysToInvalidate, tweet, onMutate, showUserName }) {
  const { userDetails } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: toggleTweetLike,
    // onMutate: tweetId => {
    //   const prevData = queryClient.getQueryData(['tweets']) || [];
    //   queryClient.cancelQueries({ queryKey: ['tweets'] });
    //   queryClient.setQueryData(['tweets'], prev => {
    //     if (!prev) return prev;

    //     return {
    //       ...prev,
    //       data: prev.data.map(tweet =>
    //         tweet.id == tweetId
    //           ? {
    //               ...tweet,
    //               likedByCurrentUser: !tweet.likedByCurrentUser,
    //               likesCount: tweet.likedByCurrentUser
    //                 ? tweet.likesCount - 1
    //                 : tweet.likesCount + 1,
    //             }
    //           : tweet
    //       ),
    //     };
    //   });
    //   return { prevData };
    // },
    onError: (err, data, context) => {
      console.log(err);
      queryClient.setQueryData(['tweets', context?.prevData]);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: keysToInvalidate });
    },
  });

  const handleToggleLike = async () => {
    if (!userDetails) {
      navigate('/login');
      return;
    }
    const response = await mutateAsync(tweet.id);
    if (response.success) {
      onMutate(tweet.id);
    }
  };

  const isLiked = tweet.likedByCurrentUser;

  return (
    <li className="border rounded-lg flex flex-col gap-2 p-4 border-green-300 ">
      {showUserName && <p className="self-end text-sm text-blue-500">@{tweet.user.userName}</p>}
      <h2 className="text-xl font-semibold">{tweet.title}</h2>
      <p className="text-gray-500">{tweet.content}</p>
      {isPending ? (
        <div className="relative">
          <img
            className={`h-[26px] ${isLiked ? 'invert' : 'animate-bounce'} `}
            src={isLiked ? notLiked : liked}
            alt="liked icon"
          />
        </div>
      ) : (
        <div className="flex" onClick={handleToggleLike}>
          <img
            className={`h-[26px] ${!isLiked && 'invert'} `}
            src={isLiked ? liked : notLiked}
            alt="liked icon"
          />
          <p className="ml-2">{tweet.likesCount}</p>
        </div>
      )}
    </li>
  );
}

export default Tweet;
