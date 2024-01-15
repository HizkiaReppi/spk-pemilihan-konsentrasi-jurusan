/* eslint-disable import/prefer-default-export */
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { registerUserValidation } from '../validators/UserValidation.js';
import validate from '../validators/validation.js';
import ClientError from '../errors/ClientError.js';
import InvariantError from '../errors/InvariantError.js';
import database from '../utils/database.js';
import { isEmailExists, isUsernameExists } from '../utils/helpersModel.js';

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

// export const login = async (payload) => {
//   const loginRequest = validate(loginUserValidation, payload);

//   const user = await prismaClient.user.findUnique({
//     where: {
//       username: loginRequest.username,
//     },
//     select: {
//       username: true,
//       password: true,
//     },
//   });

//   if (!user) {
//     throw new ResponseError(401, 'Username or password wrong');
//   }

//   const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password);

//   if (!isPasswordValid) {
//     throw new ResponseError(401, 'Username or password wrong');
//   }

//   const token = uuid().toString();
//   return prismaClient.user.update({
//     where: {
//       username: user.username,
//     },
//     data: {
//       token,
//     },
//     select: {
//       token: true,
//     },
//   });
// };
