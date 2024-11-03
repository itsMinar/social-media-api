const { loginUserSchema } = require('../../schemas/user.schemas');
const { asyncHandler } = require('../../utils/asyncHandler');
const CustomError = require('../../utils/Error');

const loginUser = asyncHandler(async (req, res, next) => {
  const parsedBody = loginUserSchema.safeParse(req.body);

  if (!parsedBody.success) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: parsedBody.error.errors.map((err) => err.message),
      hints: 'Please provide all the required fields',
    });

    return next(error);
  }

  // TODO: will complete this

  return res.json({ message: 'all good' });
});

module.exports = loginUser;
