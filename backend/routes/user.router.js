import { Router } from 'express';
import { getUserDetails, login, logout, signup } from '../services/user.services.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const userRouter = Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/logout',isAuthenticated, logout);
userRouter.get('/user-details', isAuthenticated, getUserDetails);

export default userRouter;
