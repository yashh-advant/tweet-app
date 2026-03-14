import React from 'react';
import Tweet from './Tweet';

function TweetContainer({ onMutate, tweets, keysToInvalidate, children, showUserName = true }) {
  return (
    <ul className="mx-16 mt-16 flex flex-col gap-8 text-white">
      {children}
      {tweets.map(tweet => (
        <Tweet
          keysToInvalidate={keysToInvalidate}
          onMutate={onMutate}
          showUserName={showUserName}
          key={tweet.id}
          tweet={tweet}
        />
      ))}
    </ul>
  );
}

export default TweetContainer;
