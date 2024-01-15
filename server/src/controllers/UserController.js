import { registerService } from '../services/UserService.js';
import logging from '../utils/logging.js';

// eslint-disable-next-line import/prefer-default-export
export const register = async (req, res, next) => {
  try {
    const result = await registerService(req.body);

    logging.info('Register Success');

    res.status(201).json({
      status: true,
      code: 201,
      message: 'Register Success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
