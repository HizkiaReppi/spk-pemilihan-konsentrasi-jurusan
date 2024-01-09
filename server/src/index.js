import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from './config/config.js';
import logging from './utils/logging.js';
import database from './utils/database.js';

const { port } = config.app;

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

const main = async () => {
  try {
    await database.connect();
    logging.info('Database connected...');

    app.listen(port, () => logging.info(`Server running on port ${port}`));
  } catch (error) {
    logging.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

main();
