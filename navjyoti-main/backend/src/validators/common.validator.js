import { param } from 'express-validator';

/** Validates a Mongo ObjectId route param (default: `id`). */
export const idParam = (name = 'id') =>
  [param(name).isMongoId().withMessage('Invalid id')];
