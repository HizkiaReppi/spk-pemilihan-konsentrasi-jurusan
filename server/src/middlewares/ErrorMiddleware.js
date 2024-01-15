import ClientError from '../errors/ClientError.js';
import logging from '../utils/logging.js';

const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ClientError) {
    logging.error(err.message);
    res
      .status(err.statusCode)
      .json({
        status: false,
        code: err.statusCode,
        errors: err.message,
      })
      .end();
  } else {
    logging.error(err.message);
    res
      .status(500)
      .json({
        status: false,
        code: 500,
        errors: err.message,
      })
      .end();
  }
};

export default errorMiddleware;
