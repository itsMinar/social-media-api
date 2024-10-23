const { registerUserSchema } = require('../../schemas/user.schemas');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const registerUser = asyncHandler(async (req, res, next) => {
  const validation = registerUserSchema.safeParse(req.body);

  if (!validation.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: validation.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  return res.json({ message: 'all good' });
});

module.exports = registerUser;
