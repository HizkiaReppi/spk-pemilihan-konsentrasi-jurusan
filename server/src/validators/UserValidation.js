import Joi from 'joi';

export const registerUserValidation = Joi.object({
  username: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
    }),
  fullname: Joi.string()
    .min(3)
    .max(255)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Fullname can only contain letters',
    }),
  email: Joi.string().email().max(100).required().messages({
    'string.email': 'Email must be a valid email',
  }),
  password: Joi.string().min(6).max(255).required().messages({
    'string.min': 'Password must be at least 6 characters long',
  }),
  role: Joi.string().valid('user').default('user').messages({
    'any.only': 'Role must be user',
  }),
  confirmPassword: Joi.ref('password'),
});

export const loginUserValidation = Joi.object({
  email: Joi.string().email().max(50).required().messages({
    'string.email': 'Email must be a valid email',
  }),
  password: Joi.string().min(6).max(255).required().messages({
    'string.min': 'Password must be at least 6 characters long',
  }),
});

export const getAllUsersValidation = Joi.object({
  perPage: Joi.number().integer().min(1).default(10),
  page: Joi.number().integer().min(1).default(1),
});

export const getUserByIdValidation = Joi.object({
  id: Joi.string().uuid().required(),
});

export const updateUserValidation = Joi.object({
  username: Joi.string()
    .min(3)
    .max(50)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      'string.pattern.base': 'Username can only contain letters, numbers, and underscores',
    }),
  fullname: Joi.string()
    .min(3)
    .max(255)
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      'string.pattern.base': 'Fullname can only contain letters',
    }),
  email: Joi.string().email().max(100).messages({
    'string.email': 'Email must be a valid email',
  }),
  role: Joi.string().valid('admin', 'user').default('user').messages({
    'any.only': 'Role must be admin or user',
  }),
  oldPassword: Joi.string().min(6).max(255).messages({
    'string.min': 'Password must be at least 6 characters long',
  }),
  newPassword: Joi.string().min(6).max(255).messages({
    'string.min': 'Password must be at least 6 characters long',
  }),
  confirmPassword: Joi.ref('newPassword'),
});
