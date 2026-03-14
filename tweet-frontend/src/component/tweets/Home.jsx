import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getAllTweets } from '../../services/tweets.service';
import Tweet from './Tweet';
import TweetContainer from './TweetContainer';
import queryClient from '../../lib/QueryClient';
// import { useSelector } from 'react-redux';

function Home() {
  const { data, isPending, error } = useQuery({
    queryFn: getAllTweets,
    queryKey: ['tweets'],
  });

  console.log(data);

  const handleMutate = tweetId => {
    console.log(tweetId);

    queryClient.cancelQueries({ queryKey: ['tweets'] });
    queryClient.setQueryData(['tweets'], prev => {
      if (!prev) return prev;

      return {
        ...prev,
        data: prev.data.map(tweet =>
          tweet.id == tweetId
            ? {
                ...tweet,
                likedByCurrentUser: !tweet.likedByCurrentUser,
                likesCount: tweet.likedByCurrentUser ? tweet.likesCount - 1 : tweet.likesCount + 1,
              }
            : tweet
        ),
      };
    });
  };

  return (
    <div>
      <TweetContainer
        keysToInvalidate={['tweets']}
        onMutate={handleMutate}
        tweets={data?.data || []}
      >
        {isPending && <p className="text-white">Tweets are Loading</p>}
        {error && <p>{error.message || 'Failed to fetch tweets'}</p>}
      </TweetContainer>
    </div>
  );
}

export default Home;
