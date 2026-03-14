import ApiResponse from '../utils/apiResponse.js';
import prismaClient from '../utils/prismaClient.js';

export const toggleLike = async (req, res) => {
  console.log('ran ');

  const userId = req.user?.id;
  const tweetId = req.params?.tweetId;

  if (!userId) {
    const err = new Error('User not authenticated');
    err.statusCode = 401;
    throw err;
  }

  if (!tweetId) {
    const err = new Error('tweetId is required');
    err.statusCode = 400;
    throw err;
  }

  const tweet = await prismaClient.tweet.findUnique({
    where: { id: Number(tweetId) },
    select: { id: true },
  });

  if (!tweet) {
    const err = new Error('Tweet not found');
    err.statusCode = 404;
    throw err;
  }

  const likeWhere = {
    userId_tweetId: {
      userId: Number(userId),
      tweetId: Number(tweetId),
    },
  };

  const existingLike = await prismaClient.like.findUnique({
    where: likeWhere,
    select: { userId: true, tweetId: true },
  });

  if (existingLike) {
    await prismaClient.like.delete({ where: likeWhere });
    return res.status(200).json(new ApiResponse({ liked: false }, 200, 'Like removed'));
  }

  await prismaClient.like.create({
    data: {
      userId: Number(userId),
      tweetId: Number(tweetId),
    },
  });

  console.log('ran ');

  return res.status(200).json(new ApiResponse({ liked: true }, 200, 'Like added'));
};

export const getUserLikedTweets = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    const err = new Error('User not authenticated');
    err.statusCode = 401;
    throw err;
  }

  const likes = await prismaClient.like.findMany({
    where: { userId: Number(userId) },
    include: {
      tweet: {
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
      },
    },
  });

  const formattedTweets = likes.map(like => ({
    id: like.tweet.id,
    title: like.tweet.title,
    content: like.tweet.content,
    user: like.tweet.user,
    likedByCurrentUser: true,
    likesCount: like.tweet.likes.length,
  }));

  return res.status(200).json(new ApiResponse(formattedTweets, 200, 'User liked tweets fetched'));
};
