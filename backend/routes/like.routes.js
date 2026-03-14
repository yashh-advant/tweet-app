import { Router } from 'express';
import { getUserLikedTweets, toggleLike } from '../services/like.services.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const likeRouter = Router();

likeRouter.get('/', isAuthenticated, getUserLikedTweets);

likeRouter.post('/like/:tweetId', isAuthenticated, toggleLike);

export default likeRouter;
