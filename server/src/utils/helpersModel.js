import database from './database.js';

export const isUsernameExists = async (username) => {
  const query = {
    text: 'SELECT username FROM users WHERE username = $1',
    values: [username],
  };

  const { rows } = await database.query(query);

  return rows.length !== 0;
};

export const isEmailExists = async (email) => {
  const query = {
    text: 'SELECT email FROM users WHERE email = $1',
    values: [email],
  };

  const { rows } = await database.query(query);

  return rows.length !== 0;
};
