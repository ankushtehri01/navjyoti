/**
 * Reusable list querying: pagination + search + filtering + sorting.
 * Returns `{ items, meta }` where meta = { total, page, limit, totalPages }.
 */
import { PAGINATION } from '../constants/index.js';

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Parse a `?sort=-createdAt,name` string into a Mongoose sort object. */
export const parseSort = (sort, fallback = { createdAt: -1 }) => {
  if (!sort) return fallback;
  return String(sort)
    .split(',')
    .reduce((acc, field) => {
      const trimmed = field.trim();
      if (!trimmed) return acc;
      if (trimmed.startsWith('-')) acc[trimmed.slice(1)] = -1;
      else acc[trimmed] = 1;
      return acc;
    }, {});
};

const clampLimit = (limit) => {
  const n = Number(limit) || PAGINATION.DEFAULT_LIMIT;
  return Math.min(Math.max(n, 1), PAGINATION.MAX_LIMIT);
};

/**
 * @param {import('mongoose').Model} Model
 * @param {object} opts
 * @param {object} opts.query        req.query
 * @param {object} [opts.baseFilter] filter always applied (e.g. scoping)
 * @param {string[]} [opts.searchFields] fields matched against `?search=`
 * @param {string[]} [opts.filterFields] query keys allowed as exact filters
 * @param {object} [opts.defaultSort]
 * @param {string|object} [opts.populate]
 * @param {boolean} [opts.lean=true]
 */
export const paginate = async (
  Model,
  { query = {}, baseFilter = {}, searchFields = [], filterFields = [], defaultSort, populate, lean = true }
) => {
  const page = Math.max(Number(query.page) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = clampLimit(query.limit);
  const skip = (page - 1) * limit;

  const filter = { ...baseFilter };

  // Exact-match filters from whitelisted query keys.
  for (const key of filterFields) {
    if (query[key] !== undefined && query[key] !== '') {
      filter[key] = query[key] === 'true' ? true : query[key] === 'false' ? false : query[key];
    }
  }

  // Case-insensitive OR search across configured fields.
  if (query.search && searchFields.length) {
    const rx = new RegExp(escapeRegex(String(query.search)), 'i');
    filter.$or = searchFields.map((f) => ({ [f]: rx }));
  }

  const sort = parseSort(query.sort, defaultSort);

  let q = Model.find(filter).sort(sort).skip(skip).limit(limit);
  if (populate) q = q.populate(populate);
  if (lean) q = q.lean();

  const [items, total] = await Promise.all([q.exec(), Model.countDocuments(filter)]);

  return {
    items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  };
};
