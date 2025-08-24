const Joi = require('joi');

// Validation schema for user registration
const registerSchema = Joi.object({
  username: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Username must be at least 2 characters long',
    'string.max': 'Username cannot exceed 50 characters',
    'any.required': 'Username is required',
  }),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
      'any.required': 'Password is required',
    }),
  role: Joi.string().valid('admin', 'editor').default('admin'),
});

// Validation schema for user login
const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Username is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

// Validation function for registration
const validateRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
  }

  next();
};

// Validation function for login
const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map((detail) => detail.message),
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};
