import { registerService, loginService, getAllUsersService, getUserByIdService } from '../services/UserService.js';
import logging from '../utils/logging.js';
import { getAllUsersValidation } from '../validators/UserValidation.js';
import validate from '../validators/validation.js';

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
    const { perPage, page } = validate(getAllUsersValidation, req.query);

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

export const getUserById = async (req, res, next) => {
  try {
    const data = await getUserByIdService(req.params);

    logging.info('Get User By Id Success');

    res.status(200).json({
      status: true,
      code: 200,
      message: 'Get User By Id Success',
      data,
    });
  } catch (error) {
    next(error);
  }
};
