import React, { useRef } from 'react';
import AddTweet from './AddTweet';
import { useQuery } from '@tanstack/react-query';
import { getUserTweets } from '../../services/tweets.service';
import Tweet from './Tweet';
import TweetContainer from './TweetContainer';
import queryClient from '../../lib/QueryClient';

function MyTweets() {
  const { data, isPending } = useQuery({
    queryKey: ['tweets', 'my-tweets'],
    queryFn: getUserTweets,
  });

  console.log(data);

  const modelRef = useRef(null);
  const handleShowForm = () => {
    modelRef.current.open();
  };

  const handleMutate = tweetId => {
    console.log(tweetId);

    queryClient.cancelQueries({ queryKey: ['my-tweets'] });
    queryClient.setQueryData(['tweets', 'my-tweets'], prev => {
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
    <div className="mt-8 flex flex-col ">
      <AddTweet ref={modelRef} />
      <button
        className="rounded-lg mr-8 self-end bg-blue-500 px-4 py-1 text-white transition hover:bg-blue-600 disabled:opacity-50"
        onClick={handleShowForm}
      >
        Add Tweet
      </button>

      <TweetContainer
        keysToInvalidate={['tweets', 'my-tweets']}
        onMutate={handleMutate}
        tweets={data?.data || []}
        showUserName={false}
      >
        {isPending && <p className="text-white">Loading Your Tweets</p>}{' '}
      </TweetContainer>
    </div>
  );
}

export default MyTweets;
