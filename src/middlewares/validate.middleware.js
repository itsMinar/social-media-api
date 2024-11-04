const { isValidObjectId } = require('mongoose');
const CustomError = require('../utils/Error');

const validateMongoId = (paramKey) => (req, _res, next) => {
  const id = req.params[paramKey];

  // Check if the provided ID is a valid MongoDB ObjectId
  if (!isValidObjectId(id)) {
    const error = CustomError.badRequest({
      message: 'Validation Error',
      errors: [`Invalid ${paramKey}`],
      hints: `Please ensure that the ${paramKey} is valid and try again`,
    });

    return next(error);
  }

  next();
};

module.exports = { validateMongoId };
