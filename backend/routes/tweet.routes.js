import { Router } from 'express';
import { addTweet, getAllTweets, getUserTweets, removeTweet } from '../services/tweet.services.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import isLogin from '../middleware/isLogin.js';

const tweetRouter = Router();

tweetRouter.get('', isLogin, getAllTweets);

tweetRouter.post('/', isAuthenticated, addTweet);
tweetRouter.get('/user-tweets', isAuthenticated, getUserTweets);
tweetRouter.delete('/tweets/:tweetId', isAuthenticated, removeTweet);

export default tweetRouter;
