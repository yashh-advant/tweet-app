import React, { useRef } from 'react';
import AddTweet from './AddTweet';
import { useQuery } from '@tanstack/react-query';
import { getUserTweets } from '../services/tweets.service';
import Tweet from './Tweet';

function MyTweets() {
  const { data, isPending } = useQuery({
    queryKey: [],
    queryFn: getUserTweets,
  });

  const modelRef = useRef(null);
  const handleShowForm = () => {
    modelRef.current.open();
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

      <div>{isPending && <p className="text-white">Loading Your Tweets</p>}</div>
      <ul className="m-16 flex flex-col gap-8 text-white">
        {data && data.data && data.data.map(tweet => <Tweet key={tweet.id} showUserName={false} tweet={tweet} />)}
      </ul>
    </div>
  );
}

export default MyTweets;
