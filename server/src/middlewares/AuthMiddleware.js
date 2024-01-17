import ClientError from '../errors/ClientError.js';
import { verifyToken } from '../utils/jwt.js';

// eslint-disable-next-line consistent-return
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const error = new ClientError('Token Not Found', 401);
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

export default authMiddleware;
