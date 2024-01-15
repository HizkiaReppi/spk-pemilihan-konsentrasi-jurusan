import { registerService, loginService } from '../services/UserService.js';
import logging from '../utils/logging.js';

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

export const login = async (req, res, next) => {
  try {
    const result = await loginService(req.body);

    logging.info('Login Success');

    res.status(200).json({
      status: true,
      code: 200,
      message: 'Login Success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
