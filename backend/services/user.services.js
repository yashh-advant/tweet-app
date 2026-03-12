import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ApiResponse from '../utils/apiResponse.js';
import prismaClient from '../utils/prismaClient.js';

function issueToken(payload) {
  const secret = process.env.JWT_SECRET;

  console.log(secret);

  if (!secret) {
    const err = new Error('JWT_SECRET is not set');
    err.statusCode = 500;
    throw err;
  }

  return jwt.sign(payload, secret, { expiresIn: '1d' });
}

export async function signup(req, res) {
  console.log('res ');

  const { userName, password } = req.body || {};
  if (!userName || !password) {
    const err = new Error('userName and password are required');
    err.statusCode = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prismaClient.user.create({
    data: { userName, password: hashedPassword },
    select: { id: true, userName: true },
  });

  return res.status(201).json(new ApiResponse(user, 201, 'Signup successful'));
}

export async function login(req, res) {
  const { userName, password } = req.body || {};
  if (!userName || !password) {
    const err = new Error('userName and password are required');
    err.statusCode = 400;
    throw err;
  }

  const user = await prismaClient.user.findUnique({
    where: { userName },
    select: { id: true, userName: true, password: true },
  });

  const passwordOk = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !passwordOk) {
    const err = new Error('Invalid credentials');
    err.statusCode = 401;
    throw err;
  }

  const token = issueToken({ sub: String(user.id), userName: user.userName });

  const updated = await prismaClient.user.update({
    where: { id: user.id },
    data: { token },
    select: { id: true, userName: true },
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.status(200).json(new ApiResponse(updated, 200, 'Login successful'));
}

export async function getUserDetails(req, res) {
  const userId = req.user?.id;

  if (!userId) {
    const err = new Error('User not authenticated');
    err.statusCode = 401;
    throw err;
  }

  const user = await prismaClient.user.findUnique({
    where: { id: Number(userId) },
    select: { id: true, userName: true },
  });

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return res.status(200).json(new ApiResponse(user, 200, 'User details fetched successfully'));
}

export async function logout(req, res) {
  const userId = req.user?.id;
  if (!userId) {
    const err = new Error('userId is required');
    err.statusCode = 400;
    throw err;
  }

  await prismaClient.user.update({
    where: { id: Number(userId) },
    data: { token: null },
    select: { id: true },
  });

  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return res.status(200).json(new ApiResponse(null, 200, 'Logout successful'));
}
