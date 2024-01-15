import ClientError from '../errors/ClientError.js';

const validate = (schema, payload) => {
  const { error, value } = schema.validate(payload, {
    abortEarly: false,
    allowUnknown: false,
  });

  if (error) {
    throw new ClientError(error.message);
  } else {
    return value;
  }
};

export default validate;
