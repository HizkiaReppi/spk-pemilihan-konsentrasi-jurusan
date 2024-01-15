import dotenv from 'dotenv';

dotenv.config();

const config = {
  app: {
    host: process.env.HOST,
    port: process.env.PORT,
  },
  db: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DB_PORT,
  },
  rabbitMq: {
    server: process.env.RABBITMQ_SERVER,
  },
  redis: {
    host: process.env.REDIS_SERVER,
  },
  jwt: {
    secret: process.env.SECRET_KEY,
  },
};

export default config;
