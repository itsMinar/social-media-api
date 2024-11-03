const { User } = require('../../models/user.models');
const { registerUserSchema } = require('../../schemas/user.schemas');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const registerUser = asyncHandler(async (req, res, next) => {
  const parsedBody = registerUserSchema.safeParse(req.body);

  if (!parsedBody.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: parsedBody.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  const existedUser = await User.findOne({ email: parsedBody.data.email });

  if (existedUser) {
    const error = CustomError.conflict({
      message: 'Resource Conflict',
      errors: ['User with email already exists'],
      hints:
        'Ensure the resource you are trying to create does not already exist',
    });

    return next(error);
  }

  const user = await User.create({ ...parsedBody.data });

  return res.json({ message: 'all good', user });
});

module.exports = registerUser;
