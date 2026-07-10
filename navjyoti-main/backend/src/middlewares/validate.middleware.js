/**
 * Runs express-validator chains and converts any failures into a
 * standardized 422 ApiError with field-level errors.
 *
 * Usage: router.post('/x', validate(xValidator), controller)
 */
import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';

export const validate = (validations) => async (req, _res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((e) => ({
    field: e.path,
    message: e.msg,
  }));

  return next(ApiError.unprocessable(MESSAGES.VALIDATION_FAILED, errors));
};

export default validate;
