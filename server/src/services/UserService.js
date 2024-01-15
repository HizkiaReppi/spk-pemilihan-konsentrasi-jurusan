import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { loginUserValidation, registerUserValidation } from '../validators/UserValidation.js';
import validate from '../validators/validation.js';
import ClientError from '../errors/ClientError.js';
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
