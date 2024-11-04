const { z } = require('zod');

const registerUserSchema = z.object({
  firstName: z
    .string({ message: 'firstName is required' })
    .min(1, 'First name must be at least 1 character'),
  lastName: z
    .string({ message: 'lastName is required' })
    .min(1, 'Last name must be at least 1 character'),
  email: z
    .string({ message: 'email is required' })
    .email({ message: 'Invalid Email' })
    .transform((val) => val.toLowerCase().trim()),
  password: z
    .string({ message: 'password is required' })
    .min(6, 'password must be at least 6 characters'),
  dob: z
    .preprocess(
      (arg) => {
        if (typeof arg === 'string' || arg instanceof Date) {
          return new Date(arg);
        }
        return arg;
      },
      z.date({ message: 'dob must a valid Date' })
    )
    .optional(),
  gender: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        return val.trim().toLowerCase();
      }
      return val;
    },
    z.enum(['male', 'female'], {
      required_error: 'Gender is required',
      message: 'Gender must be either male or female',
    })
  ),
  bio: z.string({ message: 'bio must be string' }).optional(),
  location: z.string({ message: 'location must be string' }).optional(),
  countryCode: z.string({ message: 'countryCode must be string' }).optional(),
  phoneNumber: z.string({ message: 'phoneNumber must be string' }).optional(),
  refreshToken: z.string({ message: 'refreshToken must be string' }).optional(),
});

const loginUserSchema = z.object({
  identifier: z
    .string({ message: 'Identifier is required' })
    .min(2, 'Identifier must be at least 2 character')
    .refine(
      (value) => {
        return (
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.trim().length > 0
        );
      },
      {
        message: 'Identifier must be a valid email or username',
      }
    ),
  password: z
    .string({ message: 'Password is required' })
    .min(6, 'Password must be at least 6 characters'),
});

const changePasswordSchema = z.object({
  oldPassword: z
    .string({ message: 'oldPassword is required' })
    .min(6, 'Old password must be at least 6 characters'),
  newPassword: z
    .string({ message: 'newPassword is required' })
    .min(6, 'New password must be at least 6 characters'),
});

const updateProfileSchema = registerUserSchema
  .omit({
    email: true,
    password: true,
  })
  .partial();

const changeUsernameSchema = z.object({
  username: z
    .string({ message: 'username is required' })
    .min(2, 'username must be at least 2 character')
    .transform((val) => val.toLowerCase().trim()),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
  changePasswordSchema,
  updateProfileSchema,
  changeUsernameSchema,
};
