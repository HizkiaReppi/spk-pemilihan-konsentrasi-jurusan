/* eslint-disable no-use-before-define */
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import {
  getUserByIdValidation,
  loginUserValidation,
  registerUserValidation,
  updateUserValidation,
} from '../validators/UserValidation.js';
import validate from '../validators/validation.js';
import ClientError from '../errors/ClientError.js';
import NotFoundError from '../errors/NotFoundError.js';
import InvariantError from '../errors/InvariantError.js';
import database from '../utils/database.js';
import { isEmailExists, isUsernameExists } from '../utils/helpersModel.js';
import { generateToken } from '../utils/jwt.js';

export const registerService = async (payload) => {
  const { fullname, username, email, password } = validate(registerUserValidation, payload);

  const isUsernameExist = await isUsernameExists(username);
  if (isUsernameExist) throw new ClientError('Username already exists');

  const isEmailExist = await isEmailExists(email);
  if (isEmailExist) throw new ClientError('Email already exists');

  const id = uuid().toString();
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = {
    text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id, fullname, username, email',
    values: [id, fullname, username, email, hashedPassword],
  };

  const { rows } = await database.query(query);

  if (!rows.length) {
    throw new InvariantError('User registration failed');
  }

  return rows[0];
};

export const loginService = async (payload) => {
  const { email, password } = validate(loginUserValidation, payload);

  const checkUser = {
    text: 'SELECT * FROM users WHERE email = $1 LIMIT 1',
    values: [email],
  };

  const { rows } = await database.query(checkUser);

  if (rows.length < 1) {
    throw new ClientError('Username or password wrong', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, rows[0].password);

  if (!isPasswordValid) {
    throw new ClientError('Username or password wrong', 401);
  }

  const token = generateToken(rows[0]);

  return { token, expiresIn: '1h' };
};

export const getAllUsersService = async (perPage, page) => {
  const query = {
    text: 'SELECT id, fullname, username, email FROM users LIMIT $1 OFFSET $2',
    values: [perPage, (page - 1) * perPage],
  };

  const { rows: data } = await database.query(query);

  const countTotal = {
    text: 'SELECT * FROM users',
  };

  const { rowCount: total } = await database.query(countTotal);

  return { data, total };
};

export const getUserByIdService = async (id) => {
  const { id: userId } = validate(getUserByIdValidation, id);

  const query = {
    text: 'SELECT * FROM users WHERE id = $1 LIMIT 1',
    values: [userId],
  };

  const { rows } = await database.query(query);

  if (rows.length < 1) {
    throw new NotFoundError('User not found');
  }

  return rows[0];
};

export const updateUserService = async (id, payload) => {
  const { id: userId } = validate(getUserByIdValidation, id);
  // eslint-disable-next-line max-len
  const { fullname, username, email, role, oldPassword, newPassword } = validate(updateUserValidation, payload);

  const query = {
    text: 'UPDATE users SET fullname = $1, username = $2, email = $3, role = $4 WHERE id = $5 RETURNING id, fullname, username, email',
    values: [fullname, username, email, role, userId],
  };

  const { rows } = await database.query(query);

  if (newPassword) {
    await _verifyPassword(userId, oldPassword);
    await _updatePasswordService(userId, newPassword);
  }

  if (rows.length < 1) {
    throw new NotFoundError('User not found');
  }

  return rows[0];
};

export const deleteUserService = async (id) => {
  const { id: userId } = validate(getUserByIdValidation, id);

  await getUserByIdService(id);

  const query = {
    text: 'DELETE FROM users WHERE id = $1',
    values: [userId],
  };

  await database.query(query);
};

const _updatePasswordService = async (id, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = {
    text: 'UPDATE users SET password = $1 WHERE id = $2 RETURNING id, fullname, username, email',
    values: [hashedPassword, id],
  };

  const { rows } = await database.query(query);

  if (rows.length < 1) {
    throw new ClientError('User not found', 404);
  }

  return rows[0];
};

const _verifyPassword = async (id, password) => {
  const query = {
    text: 'SELECT password FROM users WHERE id = $1 LIMIT 1',
    values: [id],
  };

  const { rows } = await database.query(query);

  if (rows.length < 1) {
    throw new ClientError('User not found', 404);
  }

  const isPasswordValid = await bcrypt.compare(password, rows[0].password);

  if (!isPasswordValid) {
    throw new ClientError('Old password wrong', 401);
  }
};
