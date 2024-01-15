import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from './config/config.js';
import logging from './utils/logging.js';
import database from './utils/database.js';
import router from './routers/router.js';
import errorMiddleware from './middlewares/ErrorMiddleware.js';

const { port } = config.app;

const app = express();

const main = async () => {
  try {
    app.use(helmet());
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(router);

    app.use(errorMiddleware);

    app.use((req, res) => {
      logging.error(`Endpoint not found: ${req.originalUrl}`);
      res.status(404).json({
        status: false,
        code: 404,
        errors: 'Endpoint not found',
      });
    });

    await database.connect();
    logging.info('Database connected...');

    app.listen(port, () => logging.info(`Server running on http://localhost:${port}`));
  } catch (error) {
    logging.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

main();
