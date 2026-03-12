import React from 'react';
// shadow-md shadow-green-500
function Tweet({ tweet, showUserName = true }) {
  return (
    <li className="border rounded-lg flex flex-col gap-2 p-4 border-green-300">
      {showUserName && <p className="self-end text-sm text-blue-500">@{tweet.user.userName}</p>}
      <h2 className="text-xl font-semibold">{tweet.title}</h2>
      <p className="text-gray-500">{tweet.content}</p>
    </li>
  );
}

export default Tweet;
