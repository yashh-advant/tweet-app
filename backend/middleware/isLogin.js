import jwt from 'jsonwebtoken';
import prismaClient from '../utils/prismaClient.js';

export default async function isLogin(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return next();
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next();
    }

    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch {
      return next();
    }

    const userId = Number(payload?.sub);
    if (!userId) {
      return next();
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { id: true, token: true, userName: true },
    });

    if (!user || user.token !== token) {
      return next();
    }

    req.user = { id: user.id, userName: user.userName };
    return next();
  } catch (err) {
    return next(err);
  }
}
