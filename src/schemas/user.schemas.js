const { z } = require('zod');

const registerUserSchema = z.object({
  username: z
    .string({ message: 'username is required' })
    .min(1, 'username must be at least 1 character'),
  email: z
    .string({ message: 'email is required' })
    .email({ message: 'Invalid Email' }),
  password: z
    .string({ message: 'password is required' })
    .min(6, 'password must be at least 6 characters'),
});

module.exports = {
  registerUserSchema,
};
