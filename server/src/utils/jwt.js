import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const generateToken = (userData) => jwt.sign(userData, config.jwt.secret, { expiresIn: '1h' });

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
