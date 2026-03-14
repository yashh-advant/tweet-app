import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getUserLikedTweets } from '../../services/like.services';
import Tweet from './Tweet';
import TweetContainer from './TweetContainer';
import queryClient from '../../lib/QueryClient';

function LikedTweets() {
  const { data, isPending } = useQuery({
    queryKey: ['tweets', 'liked-tweets'],
    queryFn: getUserLikedTweets,
  });

  console.log(data);

  const handleMutate = tweetId => {
    console.log(tweetId);

    queryClient.cancelQueries({ queryKey: ['tweets', 'liked-tweets'] });

    queryClient.setQueryData(['tweets', 'liked-tweets'], prev => {
      if (!prev) return prev;

      const updatedTweets = prev.data
        .map(tweet => (tweet.id === tweetId ? { ...tweet, likedByCurrentUser: false } : tweet))
        .filter(tweet => tweet.likedByCurrentUser === true);

      console.log('up ', updatedTweets);

      return {
        ...prev,
        data: updatedTweets,
      };
    });
  };

  return (
    <>
      <TweetContainer
        keysToInvalidate={['tweets', 'liked-tweets']}
        onMutate={handleMutate}
        tweets={data?.data || []}
      >
        {isPending && <p>Your Liked tweets are pending</p>}
      </TweetContainer>
    </>
  );
}

export default LikedTweets;
