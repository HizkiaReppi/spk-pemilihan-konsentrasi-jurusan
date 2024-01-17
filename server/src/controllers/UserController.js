import { registerService, loginService, getAllUsersService } from '../services/UserService.js';
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

export const getAllUsers = async (req, res, next) => {
  try {
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;

    const { data, total } = await getAllUsersService(perPage, page);

    logging.info('Get All Users Success');

    res.status(200).json({
      status: true,
      code: 200,
      message: 'Get All Users Success',
      data,
      meta: {
        perPage,
        page,
        totalData: parseInt(total, 10),
      },
    });
  } catch (error) {
    next(error);
  }
};
