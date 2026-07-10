/**
 * Employee management (admin). Creating an employee provisions a linked User
 * account with the `employee` role.
 */
import { Employee } from '../models/employee.model.js';
import { User } from '../models/user.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS, ROLES } from '../constants/index.js';
import { paginate } from '../utils/query.js';
import { pick } from '../utils/pick.js';

/** GET /employees */
export const list = asyncHandler(async (req, res) => {
  const result = await paginate(Employee, {
    query: req.query,
    searchFields: ['employeeId', 'designation'],
    filterFields: ['department', 'isActive'],
    populate: { path: 'user', select: 'name email isActive' },
  });
  return ApiResponse.ok(res, MESSAGES.FETCHED, result);
});

/** POST /employees — provisions User + Employee. */
export const create = asyncHandler(async (req, res) => {
  const { name, email, password, employeeId, department, designation } = req.body;

  const [emailTaken, idTaken] = await Promise.all([
    User.exists({ email: email.toLowerCase() }),
    Employee.exists({ employeeId }),
  ]);
  if (emailTaken) throw ApiError.conflict('An account with this email already exists');
  if (idTaken) throw ApiError.conflict('This employee ID is already in use');

  // No transaction (works on standalone Mongo too): create the user, then the
  // employee; roll back the user if employee creation fails.
  const user = await User.create({ name, email, password, role: ROLES.EMPLOYEE });
  let employee;
  try {
    employee = await Employee.create({ user: user._id, employeeId, department, designation });
  } catch (err) {
    await User.findByIdAndDelete(user._id); // compensating rollback
    throw err;
  }

  const populated = await Employee.findById(employee._id).populate('user', 'name email');
  return new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.CREATED, { item: populated }).send(res);
});

/** PUT /employees/:id */
export const update = asyncHandler(async (req, res) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) throw ApiError.notFound('Employee not found');
  Object.assign(employee, pick(req.body, ['department', 'designation', 'isActive']));
  await employee.save();

  if (req.body.name) await User.findByIdAndUpdate(employee.user, { name: req.body.name });

  const populated = await Employee.findById(employee._id).populate('user', 'name email');
  return ApiResponse.ok(res, MESSAGES.UPDATED, { item: populated });
});

/** DELETE /employees/:id — removes the employee and its user account. */
export const remove = asyncHandler(async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) throw ApiError.notFound('Employee not found');
  await User.findByIdAndDelete(employee.user);
  return ApiResponse.ok(res, MESSAGES.DELETED, null);
});
