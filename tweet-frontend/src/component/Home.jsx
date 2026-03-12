import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getAllTweets } from '../services/tweets.service';
import Tweet from './Tweet';
// import { useSelector } from 'react-redux';

function Home() {
  // const { userDetails } = useSelector(state => state.auth);
  // console.log(userDetails);

  const { data } = useQuery({
    queryFn: getAllTweets,
    queryKey: ['tweets'],
  });

  // console.log(data);

  // const isLoggedIn = userDetails != null

  return (
    <div>
      <ul className="m-16 flex flex-col gap-8 text-white">
        {data && data.data && data.data.map(tweet => <Tweet key={tweet.id} tweet={tweet} />)}
      </ul>
    </div>
  );
}

export default Home;
