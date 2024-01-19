/* eslint-disable consistent-return */
import ClientError from '../errors/ClientError.js';
import { isTokenBlacklisted, verifyToken } from '../utils/jwt.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const error = new ClientError('Token Not Found', 401);
    return next(error);
  }

  if (isTokenBlacklisted(token)) {
    const error = new ClientError('Unauthorized - Token has been revoked', 401);
    return next(error);
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

export const userMiddleware = (req, res, next) => {
  const { role, id } = req.user;
  const { id: userId } = req.params;
  if (role !== 'admin' && id !== userId) {
    const error = new ClientError('Access Forbidden', 403);
    return next(error);
  }
  next();
};

export const adminMiddleware = (req, res, next) => {
  const { role } = req.user;
  if (role !== 'admin') {
    const error = new ClientError('Access Forbidden', 403);
    return next(error);
  }
  next();
};

export default authMiddleware;
