import ApiResponse from '../utils/apiResponse.js';
import prismaClient from '../utils/prismaClient.js';

export async function getAllTweets(req, res) {
  try {
    const userId = req.user?.id;

    const tweets = await prismaClient.tweet.findMany({
      include: {
        user: {
          select: {
            id: true,
            userName: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });

    const formattedTweets = tweets.map(tweet => ({
      id: tweet.id,
      title: tweet.title,
      content: tweet.content,
      user: tweet.user,
      likesCount: tweet.likes.length,
      likedByCurrentUser: tweet.likes.some(like => like.userId === userId),
    }));

    return res
      .status(200)
      .json(new ApiResponse(formattedTweets, 200, 'Tweets fetched successfully'));
  } catch (error) {
    console.error('getAllTweets error:', error);
    return res.status(500).json({ message: error.message });
  }
}

export async function addTweet(req, res) {
  const { title, content } = req.body || {};
  const userId = req.user?.id;

  if (!title || !content) {
    const err = new Error('title and content are required');
    err.statusCode = 400;
    throw err;
  }

  if (!userId) {
    const err = new Error('User not authenticated');
    err.statusCode = 401;
    throw err;
  }

  const tweet = await prismaClient.tweet.create({
    data: {
      title,
      content,
      userId: Number(userId),
    },
  });

  return res.status(201).json(new ApiResponse(tweet, 201, 'Tweet created successfully'));
}

export async function removeTweet(req, res) {
  const tweetId = req.params?.tweetId ?? req.body?.tweetId;
  const userId = req.user?.id;

  if (!tweetId) {
    const err = new Error('tweetId is required');
    err.statusCode = 400;
    throw err;
  }

  if (!userId) {
    const err = new Error('User not authenticated');
    err.statusCode = 401;
    throw err;
  }

  const tweet = await prismaClient.tweet.findUnique({
    where: { id: Number(tweetId) },
    select: { id: true, userId: true },
  });

  if (!tweet) {
    const err = new Error('Tweet not found');
    err.statusCode = 404;
    throw err;
  }

  if (tweet.userId !== userId) {
    const err = new Error('You are not authorized to delete this tweet');
    err.statusCode = 403;
    throw err;
  }

  await prismaClient.tweet.delete({
    where: { id: Number(tweetId) },
  });

  return res.status(200).json(new ApiResponse(null, 200, 'Tweet removed successfully'));
}

export async function getUserTweets(req, res) {
  const userId = req.user?.id;

  if (!userId) {
    const err = new Error('User not authenticated');
    err.statusCode = 401;
    throw err;
  }

  const tweets = await prismaClient.tweet.findMany({
    where: { userId: Number(userId) },
    include: {
      likes: {
        select: {
          userId: true,
        },
      },
    },
  });

  // console.log(tweets);
  

  const formattedTweets = tweets.map(tweet => ({
    ...tweet,
    likesCount:tweet.likes.length,
    likedByCurrentUser: tweet.likes.some(like => like.userId === userId),
  }));

  return res
    .status(200)
    .json(new ApiResponse(formattedTweets, 200, ' User Tweets fetched successfully'));
}
