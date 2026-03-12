import jwt from 'jsonwebtoken';
import prismaClient from '../utils/prismaClient.js';

export default async function isAuthenticated(req, res, next) {
  try {
    const token = req.cookies?.token;

    if (!token) {
      const err = new Error('Authentication token missing');
      err.statusCode = 401;
      throw err;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const err = new Error('JWT_SECRET is not set');
      err.statusCode = 500;
      throw err;
    }

    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch {
      const err = new Error('Invalid or expired token');
      err.statusCode = 401;
      throw err;
    }

    const userId = Number(payload?.sub);
    if (!userId) {
      const err = new Error('Invalid token payload');
      err.statusCode = 401;
      throw err;
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { id: true, token: true, userName: true },
    });

    if (!user || user.token !== token) {
      const err = new Error('Not authenticated');
      err.statusCode = 401;
      throw err;
    }

    req.user = { id: user.id, userName: user.userName };
    return next();
  } catch (err) {
    return next(err);
  }
}
