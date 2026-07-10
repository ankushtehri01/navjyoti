/**
 * Generic CRUD controller factory. Produces list/getOne/create/update/remove
 * handlers for an entity so simple resources need almost no boilerplate.
 * Custom entities (applications, documents, ...) implement their own handlers.
 */
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
import { HTTP_STATUS } from '../constants/index.js';
import { paginate } from '../utils/query.js';
import { pick } from '../utils/pick.js';

export const createCrudController = (Model, options = {}) => {
  const {
    searchFields = [],
    filterFields = [],
    defaultSort = { createdAt: -1 },
    populate,
    writableFields = [],
    baseFilter = () => ({}),
    resourceName = 'Record',
  } = options;

  const list = asyncHandler(async (req, res) => {
    const result = await paginate(Model, {
      query: req.query,
      baseFilter: baseFilter(req),
      searchFields,
      filterFields,
      defaultSort,
      populate,
    });
    return ApiResponse.ok(res, MESSAGES.FETCHED, result);
  });

  const getOne = asyncHandler(async (req, res) => {
    let query = Model.findOne({ _id: req.params.id, ...baseFilter(req) });
    if (populate) query = query.populate(populate);
    const doc = await query;
    if (!doc) throw ApiError.notFound(`${resourceName} not found`);
    return ApiResponse.ok(res, MESSAGES.FETCHED, { item: doc });
  });

  const create = asyncHandler(async (req, res) => {
    const payload = writableFields.length ? pick(req.body, writableFields) : req.body;
    const doc = await Model.create(payload);
    return new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.CREATED, { item: doc }).send(res);
  });

  const update = asyncHandler(async (req, res) => {
    const payload = writableFields.length ? pick(req.body, writableFields) : req.body;
    const doc = await Model.findById(req.params.id);
    if (!doc) throw ApiError.notFound(`${resourceName} not found`);
    Object.assign(doc, payload);
    await doc.save(); // save() so pre-save hooks (slug, etc.) run
    return ApiResponse.ok(res, MESSAGES.UPDATED, { item: doc });
  });

  const remove = asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) throw ApiError.notFound(`${resourceName} not found`);
    return ApiResponse.ok(res, MESSAGES.DELETED, null);
  });

  return { list, getOne, create, update, remove };
};

export default createCrudController;
