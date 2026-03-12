import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRouter from './routes/user.router.js';
import tweetRouter from './routes/tweet.routes.js';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/v1/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tweets', tweetRouter);

app.use((err, req, res, next) => {
  const status = err?.statusCode || err?.status || 500;
  res.status(status).json({
    message: err?.message || 'Internal Server Error',
  });
});

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
